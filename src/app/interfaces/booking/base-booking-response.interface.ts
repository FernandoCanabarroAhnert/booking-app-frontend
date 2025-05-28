export interface IBaseBookingResponse {
    id: number;
    checkIn: Date;
    checkOut: Date;
    guestsQuantity: number;
    createdAt: Date;
    finished: boolean;
    totalPrice: number;
}