import { IHotelResponse } from "../hotel/hotel-response.interface";
import { IImageResponse } from "../images/image-response.interface";

export interface IRoomDetailResponse {
    id: number;
    number: string;
    floor: number;
    type: number;
    pricePerNight: number;
    description: string;
    capacity: number;
    ratingsQuantity: number;
    averageRating: number;
    hotel: IHotelResponse;
    unavailableDates: Date[];
    images: IImageResponse[];
}