import express, { Express, Request, Response } from "express"
import woocommerce from "./src/rest/woocommerce"
import pagseguro from "./src/rest/pagseguro"
import order from "./src/rest/order"

export const router = express.Router()

router.use("/woocommerce", woocommerce)
router.use("/pagseguro", pagseguro)
router.use("/order", order)
