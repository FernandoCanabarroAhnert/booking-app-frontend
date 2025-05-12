import { IImageResponse } from "./image-response.interface";

export interface IHotelResponse {
    id: number;
    name: string;
    description: string;
    roomQuantity: number;
    street: string;
    number: string;
    city: string;
    zipCode: string;
    state: string;
    phone: string;
    cardDisplayImage: IImageResponse;
}