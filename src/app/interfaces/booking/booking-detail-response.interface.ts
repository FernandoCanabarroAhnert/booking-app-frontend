import { IPaymentResponse } from "../payment/payment-response.interface";
import { IRoomResponse } from "../room/room-response.interface";
import { IUserResponse } from "../user/user-response.interface";
import { IBaseBookingResponse } from "./base-booking-response.interface";

export interface IBookingDetailResponse extends IBaseBookingResponse {
    user: IUserResponse;
    room: IRoomResponse;
    payment: IPaymentResponse;
}