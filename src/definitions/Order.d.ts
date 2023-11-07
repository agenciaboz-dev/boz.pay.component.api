declare type PaymentMethod = "card" | "pix" | "boleto"

declare interface CardOrderForm extends OrderForm {
    encrypted: string
    expiry: string
    cvv: string
    cardOwner: string
    type: "credit" | "debit"
    installments: number

    auth?: string
}

declare interface OrderForm {
    referenceId: string
    store: string
    status: string
    dateCreated: string
    dateModified: string
    total: number
    customerId?: string
}

declare interface GetOrder {
    referenceId: number
    store: string
}

declare interface PersonalDataForm {
    name: string
    cpf: string
    phone: string
    email: string
}

declare interface AddressForm {
    address: string
    district: string
    city: string
    state: string
    postcode: string
}

declare interface BillShippingForm {
    address: AddressForm
    personalData: PersonalDataForm
}

declare interface ProductForm {
    name: string
    price: number
    quantity: number
    referenceId: string | number
}