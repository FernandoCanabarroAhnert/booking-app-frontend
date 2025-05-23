import { IBaseHotelResponse } from "../interfaces/hotel/base-hotel-response.interface";

export function getHotelFullAddress(hotel: IBaseHotelResponse): string {
  return `${hotel.street}, ${hotel.number} - ${hotel.city}/${hotel.state} - ${hotel.zipCode}`;
}