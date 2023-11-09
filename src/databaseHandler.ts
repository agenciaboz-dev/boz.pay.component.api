import { Billing, Order, PrismaClient, Shipping } from "@prisma/client"

const prisma = new PrismaClient()

const inclusions = {
    order: {
        billing: { include: { address: true, personalData: true } },
        shipping: { include: { address: true, personalData: true } },
        products: true,
    },
}

const order = {
    find: async (data: GetOrder) =>
        await prisma.order.findFirst({
            where: { AND: [{ referenceId: data.referenceId.toString() }, { store: data.store }] },
            include: inclusions.order,
        }),
    new: async (data: { order: OrderForm; billing: BillShippingForm; shipping: BillShippingForm; products: ProductForm[] }) => {
        const shippingAddress = await prisma.address.create({
            data: {
                address: data.shipping.address.address,
                city: data.shipping.address.city,
                district: data.shipping.address.district,
                postcode: data.shipping.address.postcode,
                state: data.shipping.address.state,
                complement: data.shipping.address.complement,
                number: data.shipping.address.number,
            },
        })
        console.log("created shipping address")
        const shippingPersonalData = await prisma.personalData.create({
            data: {
                cpf: data.shipping.personalData.cpf,
                email: data.shipping.personalData.email,
                name: data.shipping.personalData.name,
                phone: data.shipping.personalData.phone,
            },
        })
        console.log("created shipping personal data")
        const shipping = await prisma.shipping.create({
            data: {
                addressId: shippingAddress.id,
                personalDataId: shippingPersonalData.id,
            },
        })

        console.log("created shipping")
        const billingAddress = await prisma.address.create({
            data: {
                address: data.billing.address.address,
                city: data.billing.address.city,
                district: data.billing.address.district,
                postcode: data.billing.address.postcode,
                state: data.billing.address.state,
                complement: data.billing.address.complement,
                number: data.billing.address.number,
            },
        })
        console.log("created billing address")
        const billingPersonalData = await prisma.personalData.create({
            data: {
                cpf: data.billing.personalData.cpf,
                email: data.billing.personalData.email,
                name: data.billing.personalData.name,
                phone: data.billing.personalData.phone,
            },
        })

        console.log("created billing personal data")
        const billing = await prisma.billing.create({
            data: {
                addressId: billingAddress.id,
                personalDataId: billingPersonalData.id,
            },
        })

        console.log("created billing")
        const order = await prisma.order.create({
            data: {
                status: data.order.status,
                customerId: data.order.customerId,
                dateCreated: data.order.dateCreated,
                dateModified: data.order.dateModified,
                total: data.order.total,
                referenceId: data.order.referenceId,
                store: data.order.store,
                shippingId: shipping.id,
                billingId: billing.id,
                products: {
                    createMany: {
                        data: data.products.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            referenceId: item.referenceId.toString(),
                        })),
                    },
                },
            },
            include: inclusions.order,
        })

        console.log("created order")
        return order
    },
    updateTotal: async (id: number, total: number) => await prisma.order.update({ where: { id }, data: { total } }),
}

export default { order }
