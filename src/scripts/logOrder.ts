import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs"
import { sendMail } from "./mail"
import { PrismaClient } from "@prisma/client"
import axios from "axios"
import Mail from "nodemailer/lib/mailer"

const prisma = new PrismaClient()

export const homologationLog = async (
    token: string,
    request: {
        id: number
        total: number
        method: PaymentMethod
    } & (PayForm | CardOrderForm),
    response: any
) => {
    const order_prisma = await prisma.order.findFirst({ where: { id: request.id } })
    const store = order_prisma?.store
    const splitted_store = store?.split("casaludica.mkt-")
    if (splitted_store?.length == 2) {
        const store_id = Number(splitted_store[1])
        const casaludica_response = await axios.post("https://agencyboz.com:4100/api/franchise/refresh", { franchise_id: store_id })
        const franchise = casaludica_response.data
        if (franchise) {
            const base_path = `logs/homologation/${store}`
            if (!existsSync(base_path)) {
                mkdirSync(base_path, { recursive: true })
            }

            const file_path = `${base_path}/${request.method}.txt`
            writeFileSync(file_path, JSON.stringify({ request: request || "undefined", response: response }, null, 4))

            const email = (franchise.email as string).toLowerCase()
            const files = readdirSync(base_path)
            if (files.length == 2) {
                const attachments = files.map((path) => {
                    const file = readFileSync(`${base_path}/${path}`)
                    const attachment: Mail.Attachment = {
                        filename: path,
                        content: file,
                        contentType: "txt",
                    }
                    return attachment
                })

                const mail_result = await sendMail(
                    [email, "fernando@agenciaboz.com.br", "mizael@agenciaboz.com.br"],
                    `Anexos homolocação Pagseguro`,
                    `Segue anexos para inserção no formulário de homologação PagBank, caso tenha alguma dúvida de como proceder, por favor consulte o passo a passo neste link: https://docs.google.com/document/d/1eDOBn7qLZWKZcT4maKQHXpeqjruqsapLHUxkWNrcxXk/edit?usp=sharing`,
                    `<p>Segue anexos para inserção no formulário de homologação PagBank, caso tenha alguma dúvida de como proceder, por favor consulte o passo a passo neste link: https://docs.google.com/document/d/1eDOBn7qLZWKZcT4maKQHXpeqjruqsapLHUxkWNrcxXk/edit?usp=sharing</p>`,
                    attachments
                )

                console.log(mail_result)
            }
        }
    }
}
