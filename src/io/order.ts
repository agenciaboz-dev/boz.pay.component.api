import { Socket } from "socket.io"
import databaseHandler from "../databaseHandler"
import woocommerce from "../api/woocommerce"
import pagseguro from "../api/pagseguro"
import frenet from "../api/frenet"

const get = async (data: GetOrder, socket: Socket) => {
    console.log(data)
    try {
        const order = await databaseHandler.order.find(data)
        socket.emit("order", order)

        if (order) {
            try {
                const quoteResponse = await frenet.quote(order)
                const quoteList = quoteResponse.ShippingSevicesArray
                // console.log(quoteResponse)
                socket.emit("quote", quoteList)
            } catch (error) {
                console.log(error)
                socket.emit("quote", [])
            }
        }
    } catch (error) {
        console.log(error)
        socket.emit("error", error)
    }
}

const pay = async (order: { id: number; total: number; method: PaymentMethod } & (PayForm | CardOrderForm), socket: Socket) => {
    try {
        if (order.method == "card") {
            if ((order as CardOrderForm).type == "debit" && !(order as CardOrderForm).auth) {
                let session = pagseguro.getSession()
                
                if (!session || new Date() >= new Date(session.expires_at)) {
                    session = await pagseguro.auth3ds(order.pagseguro)
                }
                
                socket.emit("pagseguro:3ds", session)
                return
            }
        }
        
        await databaseHandler.order.updateTotal(order.id, Number(order.total))
        const woocommerce = await databaseHandler.order.getWoocommerce(order.id)
        pagseguro.order(order, socket, woocommerce)
    } catch (error) {
        console.log(error)
        socket.emit("order:pay:error", error)
    }
}

export default { get, pay }
