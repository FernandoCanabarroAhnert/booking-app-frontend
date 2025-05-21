export interface ICreditCardResponse {
    id: number;
    holderName: string;
    lastFourDigits: string;
    brand: number;
    expirationDate: string;
}