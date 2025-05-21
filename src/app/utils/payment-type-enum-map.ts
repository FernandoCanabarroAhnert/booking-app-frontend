import { PaymentTypeEnum } from "../enums/payment-type.enum";

export const paymentTypeEnumMap: { [key in PaymentTypeEnum]: string } = {
    [PaymentTypeEnum.DINHEIRO]: 'Dinheiro',
    [PaymentTypeEnum.CARTAO]: 'Cartão de Crédito',
    [PaymentTypeEnum.PIX]: 'Pix',
    [PaymentTypeEnum.BOLETO]: 'Boleto'
}