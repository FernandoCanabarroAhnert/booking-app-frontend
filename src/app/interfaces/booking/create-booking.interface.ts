import { IPaymentRequest } from "../payment/payment-request.interface";
import { IBaseBookingRequest } from "./base-booking-request.interface";

export interface ICreateBooking extends IBaseBookingRequest {
    payment: IPaymentRequest;
}