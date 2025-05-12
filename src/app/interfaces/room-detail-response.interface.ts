import { IHotelResponse } from "./hotel-response.interface";
import { IImageResponse } from "./image-response.interface";

export interface IRoomDetailResponse {
    id: number;
    number: string;
    floor: number;
    type: number;
    pricePerNight: number;
    description: string;
    capacity: number;
    hotel: IHotelResponse;
    unavailableDates: Date[];
    images: IImageResponse[];
}