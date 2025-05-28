export interface IBaseBookingRequest {
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    guestsQuantity: number;
}