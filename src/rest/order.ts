import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import databaseHandler from "../databaseHandler"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/new", async (request: Request, response: Response) => {
    const data: { order: OrderForm; billing: BillShippingForm; shipping: BillShippingForm; products: ProductForm[] } = request.body

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
