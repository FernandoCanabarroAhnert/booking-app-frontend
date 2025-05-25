import { IHotelResponse } from "../hotel/hotel-response.interface";
import { IImageResponse } from "../images/image-response.interface";
import { IBaseRoomResponse } from "./base-room-response.interface";

export interface IRoomDetailResponse extends IBaseRoomResponse {
    hotel: IHotelResponse;
    unavailableDates: Date[];
    images: IImageResponse[];
}