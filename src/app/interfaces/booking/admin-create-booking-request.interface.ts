import { ICreateBooking } from "./create-booking.interface";

export interface IAdminCreateBookingRequest extends ICreateBooking {
    userId: number;
}