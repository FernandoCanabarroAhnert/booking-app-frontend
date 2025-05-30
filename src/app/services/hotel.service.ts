import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { HotelList } from '../types/hotel-list.type';
import { IHotelDetailResponse } from '../interfaces/hotel/hotel-detail-response.interface';
import { IHotelSearchResponse } from '../interfaces/hotel/hotel-search-response.interface';
import { IRoomResponse } from '../interfaces/room/room-response.interface';
import { RoomList } from '../types/room-list.type';
import { APPLY_AUTH_TOKEN } from '../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:8080/api/v1/hotels';

  findAllByName(name: string): Observable<IHotelSearchResponse[]> {
    return this._http.get<IHotelSearchResponse[]>(`${this._baseUrl}/search`, { params: { name } });
  }

  findAllHotels(page: number, size: number, name: string = ''): Observable<IPageResponse<HotelList>> {
    return this._http.get<IPageResponse<HotelList>>(`${this._baseUrl}`, { params: { page: page - 1, size, name },
       context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  findAllRoomsByHotelId(id: number, page: number, size: number): Observable<IPageResponse<RoomList>> {
    return this._http.get<IPageResponse<RoomList>>(`${this._baseUrl}/${id}/rooms`, { params: { page: page - 1, size }, 
      context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  findById(id: number): Observable<IHotelDetailResponse> {
    return this._http.get<IHotelDetailResponse>(`${this._baseUrl}/${id}`, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  createHotel(hotel: FormData): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}`, hotel);
  }

  updateHotel(id: number, hotel: FormData): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/${id}`, hotel);
  }

  deleteImages(imagesIds: number[]): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/images`, { params: { imagesIds } });
  }

  deleteHotel(id: number): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }

  exportToPdf() {
    const options = {
      responseType: 'blob' as const
    };
    return this._http.get(`${this._baseUrl}/pdf`, options);
  }

  exportToExcel() {
    const options = {
      responseType: 'blob' as const
    };
    return this._http.get(`${this._baseUrl}/excel`, options);
  }

}
