export interface IBookingFormFilterResponse {
    checkIn: string;
    checkOut: string;
    hotelId: number;
    minPrice: number;
    maxPrice: number;
    paymentType: string[];
}