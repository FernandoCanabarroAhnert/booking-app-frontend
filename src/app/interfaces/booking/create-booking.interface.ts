import { IPaymentRequest } from "../payment/payment-request.interface";

export interface ICreateBooking {
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    guestsQuantity: number;
    payment: IPaymentRequest;
}