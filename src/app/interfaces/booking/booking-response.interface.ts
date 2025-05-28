import { IBaseBookingResponse } from "./base-booking-response.interface";

export interface IBookingResponse extends IBaseBookingResponse {
    paymentType: number;
    userId: number;
    userFullName: string;
    userCpf: string;
    roomId: number;
    hotelName: string;
}