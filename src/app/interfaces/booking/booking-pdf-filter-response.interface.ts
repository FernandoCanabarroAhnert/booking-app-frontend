export interface IBookingPdfFilterResponse {
    checkIn: string;
    checkOut: string;
    hotelId: number;
    minAmount: number;
    maxAmount: number;
    dinheiro: string;
    cartao: string;
    pix: string;
    boleto: string;
}