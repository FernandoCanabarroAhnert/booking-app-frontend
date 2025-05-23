import { IImageResponse } from "../images/image-response.interface";
import { IBaseHotelResponse } from "./base-hotel-response.interface";

export interface IHotelResponse extends IBaseHotelResponse {
    cardDisplayImage: IImageResponse;
}