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
            },
        })
        const shippingPersonalData = await prisma.personalData.create({
            data: {
                cpf: data.shipping.personalData.cpf,
                email: data.shipping.personalData.email,
                name: data.shipping.personalData.name,
                phone: data.shipping.personalData.phone,
            },
        })
        const shipping = await prisma.shipping.create({
            data: {
                addressId: shippingAddress.id,
                personalDataId: shippingPersonalData.id,
            },
        })

        const billingAddress = await prisma.address.create({
            data: {
                address: data.billing.address.address,
                city: data.billing.address.city,
                district: data.billing.address.district,
                postcode: data.billing.address.postcode,
                state: data.billing.address.state,
            },
        })
        const billingPersonalData = await prisma.personalData.create({
            data: {
                cpf: data.billing.personalData.cpf,
                email: data.billing.personalData.email,
                name: data.billing.personalData.name,
                phone: data.billing.personalData.phone,
            },
        })

        const billing = await prisma.billing.create({
            data: {
                addressId: billingAddress.id,
                personalDataId: billingPersonalData.id,
            },
        })

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

        return order
    },
}

export default { order }
