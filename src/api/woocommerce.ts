import { Woocommerce } from "@prisma/client"
import axios from "axios"

const updateOrderStatus = async (orderId: string | number, status: string, woocommerce: Woocommerce) => {
    const api = axios.create({ baseURL: woocommerce.baseUrl })
    
    const consumer = {
        key: woocommerce.consumerKey,
        secret: woocommerce.consumerSecret,
    }

    const response = await api.put(
        `/orders/${orderId}`,
        { status },
        {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: consumer.key,
                password: consumer.secret,
            },
        }
    )

    return response.data
}

export default { updateOrderStatus }
