export interface ICreditCardRequest {
    holderName: string;
    cardNumber: string;
    cvv: string;
    expirationDate: string;
    brand: number;
}