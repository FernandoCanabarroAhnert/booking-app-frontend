export interface IPaymentRequest {
    isOnlinePayment: boolean;
    paymentType: number;
    installmentQuantity: number | null;
    creditCardId: number | null;
}