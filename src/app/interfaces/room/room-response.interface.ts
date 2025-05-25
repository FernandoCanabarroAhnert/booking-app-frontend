import { IImageResponse } from "../images/image-response.interface";
import { IBaseRoomResponse } from "./base-room-response.interface";

export interface IRoomResponse extends IBaseRoomResponse {
    hotelName: string;
    hotelId: number;
    cardDisplayImage: IImageResponse;
}