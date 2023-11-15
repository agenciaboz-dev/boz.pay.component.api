declare type PaymentMethod = "card" | "pix" | "boleto"

declare interface PagseguroCreds {
    sandbox: boolean
    token: string
}
declare interface CardOrderForm extends PayForm {
    encrypted: string
    expiry: string
    cvv: string
    cardOwner: string
    type: "credit" | "debit"
    installments: number

    auth?: string
}

declare interface PayForm {
    id: number
    method: PaymentMethod
    total: string
    encrypted: string
    store: string
    name: string
    cpf: string
    phone: string
    email: string
    postcode: string
    address: string
    city: string
    state: string
    complement: string
    district: string
    number: string
    pagseguro: PagseguroCreds
}

declare interface WoocommerceForm {
    pagToken: string
    pagSandboxToken: string
    pagseguroKey: string
    baseUrl: string
    consumerKey: string
    consumerSecret: string
    sandbox: boolean
}

declare interface OrderForm {
    referenceId: string
    store: string
    status: string
    dateCreated: string
    dateModified: string
    total: number
    customerId?: string
    woocommerce?: WoocommerceForm
}

declare interface GetOrder {
    referenceId: string
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
    number: string
    district: string
    city: string
    state: string
    postcode: string
    number: string
    complement?: string
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