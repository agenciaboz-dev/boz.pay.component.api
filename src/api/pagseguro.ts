import axios from "axios"
import { Billing, Order, PrismaClient } from "@prisma/client"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { Socket } from "socket.io"
import { getDueDate } from "../scripts/formatDate"

const prisma = new PrismaClient()

// returns PAID
// Número: 4539620659922097
// Cód. de Seg.: 123
// Data Exp.:12/2026

// returns DECLINED
// Número: 4929291898380766
// Cód. de Seg.: 123
// Data Exp.:12/2026

// DEBIT CARDS
// declined with challenge (working)
// 4000000000002370
// success without challenge
// 5200000000001096
// success with challenge (working)
// 5200000000001096
// fail - not supported (need to handle)
// 4000000000002719

let session: PagseguroSession | undefined

const getSession = () => session

const order = (order: { id: number; total: number; method: PaymentMethod } & (PayForm | CardOrderForm), socket: Socket) => {
    const api = axios.create({
        baseURL: order.pagseguro.sandbox ? "https://sandbox.api.pagseguro.com" : "https://api.pagseguro.com",
        timeout: 1000 * 10,
    })
    const headers = { Authorization: order.pagseguro.token }

    console.log(order)
    const pag_order: PagseguroOrder = {
        reference_id: order.id.toString(),
        customer: {
            name: order.name,
            tax_id: order.cpf.replace(/\D/g, ""),
            email: order.email,
        },
        items: [
            {
                name: "Pabinka",
                quantity: 1,
                unit_amount: Math.round(order.total * 100),
            },
        ],
        notification_urls: ["https://agencyboz.com:4118/api/pagseguro/webhook"],

        qr_codes: order.method == "pix" ? [{ amount: { value: Math.round(order.total * 100) } }] : undefined,
        charges:
            order.method == "card" || order.method == "boleto"
                ? [
                      {
                          reference_id: order.id.toString(),
                          amount: { currency: "BRL", value: Math.round(order.total * 100) },
                          payment_method: {
                              capture: true,
                              card:
                                  order.method == "card"
                                      ? {
                                            encrypted: (order as CardOrderForm).encrypted,
                                            holder: {
                                                name: (order as CardOrderForm).cardOwner,
                                            },
                                            security_code: (order as CardOrderForm).cvv,
                                            store: false,
                                        }
                                      : undefined,

                              boleto:
                                  order.method == "boleto"
                                      ? {
                                            due_date: getDueDate(),
                                            instruction_lines: {
                                                line_1: "Via PagSeguro",
                                                line_2: "Via PagSeguro",
                                            },
                                            holder: {
                                                name: order.name,
                                                email: order.email,
                                                tax_id: order.cpf.replace(/\D/g, ""),
                                                address: {
                                                    city: order.city,
                                                    country: "Brasil",
                                                    locality: order.district || "nao informado",
                                                    number: order.number,
                                                    postal_code: order.postcode.replace(/\D/g, ""),
                                                    street: order.address,
                                                    region_code: order.state,
                                                    region: order.state,
                                                    complement: order.complement || "nao informado",
                                                },
                                            },
                                        }
                                      : undefined,

                              authentication_method: (order as CardOrderForm).auth
                                  ? {
                                        id: (order as CardOrderForm).auth || "",
                                        type: "THREEDS",
                                    }
                                  : undefined,
                              installments: order.method == "card" ? (order as CardOrderForm).installments : undefined,
                              type: order.method == "card" ? ((order as CardOrderForm).type == "debit" ? "DEBIT_CARD" : "CREDIT_CARD") : "BOLETO",
                          },
                      },
                  ]
                : undefined,
    }

    console.log(pag_order)

    api.post("/orders", pag_order, { headers })
        .then((response) => {
            console.log(response.data)
            if (order.method == "pix") {
                socket.emit("qrcode", response.data.qr_codes[0])
            }

            if (order.method == "boleto") {
                socket.emit("pagseguro:boleto", { boleto: response.data.charges[0].payment_method.boleto, links: response.data.charges[0].links })
            }

            if (!existsSync("logs")) {
                mkdirSync("logs")
            }

            writeFileSync(`logs/new_order-${order.id}.txt`, JSON.stringify({ request: order || "undefined", response: response.data }, null, 4))
        })
        .catch(async (error) => {
            console.log("error")
            console.log(error.response?.data || error)
            socket.emit("order:pay:error", error.response?.data?.error_messages ? error.response.data.error_messages[0] : "erro desconhecido")
            await prisma.order.update({
                where: { id: Number(order.id) },
                data: {
                    status: "error",
                    pag_error: error.response.data.error_messages?.map((error: any) => error.description).toString() || "erro desconhecido",
                },
            })
        })
}

const auth3ds = async (data: PagseguroCreds) => {
    const api = axios.create({
        baseURL: data.sandbox ? "https://sandbox.api.pagseguro.com" : "https://api.pagseguro.com",
        timeout: 1000 * 10,
    })

    const authHeader = { Authorization: data.token, ContentType: "application/json" }
    const response = await api.post("/checkout-sdk/sessions", {}, { headers: authHeader })
    console.log(response.data)
    session = response.data
    return session
}

export default { order, auth3ds, getSession }
