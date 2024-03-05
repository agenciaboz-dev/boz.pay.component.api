import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import databaseHandler from "../databaseHandler"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data: { store: string; referenceId: string; id?: number } = request.body
    try {
        console.log(data)
        const order = await databaseHandler.order.find(data)
        console.log({ order })
        response.json(order)
    } catch (error) {
        console.log(error)
        response.json(error)
    }
})

router.post("/new", async (request: Request, response: Response) => {
    const data: { order: OrderForm; billing: BillShippingForm; shipping: BillShippingForm; products: ProductForm[]; woocommerce?: WoocommerceForm } =
        request.body
    console.log(data)

    try {
        console.log(`new order for ${data.order.store}`)
        const order = await databaseHandler.order.new(data)
        response.json({ order })
    } catch (error) {
        console.log(error)
        response.json({ error })
    }
})

export default router
