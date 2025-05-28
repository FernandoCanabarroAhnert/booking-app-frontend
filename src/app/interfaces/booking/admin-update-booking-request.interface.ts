import { IBaseBookingRequest } from "./base-booking-request.interface";

export interface IAdminUpdateBookingRequest extends IBaseBookingRequest {
    userId: number;
    isFinished: boolean;
}