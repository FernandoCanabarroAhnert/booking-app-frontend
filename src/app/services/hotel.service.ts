import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { HotelList } from '../types/hotel-list.type';
import { IHotelDetailResponse } from '../interfaces/hotel/hotel-detail-response.interface';
import { IHotelSearchResponse } from '../interfaces/hotel/hotel-search-response.interface';
import { IRoomResponse } from '../interfaces/room/room-response.interface';
import { RoomList } from '../types/room-list.type';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:8080/api/v1/hotels';

  findAllByName(name: string): Observable<IHotelSearchResponse[]> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`);  
    return this._http.get<IHotelSearchResponse[]>(`${this._baseUrl}/search`, { params: { name }, headers });
  }

  findAllHotels(page: number, size: number, name: string = ''): Observable<IPageResponse<HotelList>> {
    return this._http.get<IPageResponse<HotelList>>(`${this._baseUrl}`, { params: { page: page - 1, size, name } })
  }

  findAllRoomsByHotelId(id: number, page: number, size: number): Observable<IPageResponse<RoomList>> {
    return this._http.get<IPageResponse<RoomList>>(`${this._baseUrl}/${id}/rooms`, { params: { page: page - 1, size } });
  }

  findById(id: number): Observable<IHotelDetailResponse> {
    return this._http.get<IHotelDetailResponse>(`${this._baseUrl}/${id}`);
  }

  createHotel(hotel: FormData): Observable<void> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`);  
    return this._http.post<void>(`${this._baseUrl}`, hotel, { headers });
  }

  updateHotel(id: number, hotel: FormData): Observable<void> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`);  
    return this._http.put<void>(`${this._baseUrl}/${id}`, hotel, { headers });
  }

  deleteImage(imageId: number): Observable<void> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`);  
    return this._http.delete<void>(`${this._baseUrl}/${imageId}/images`, { headers });
  }

  exportToPdf() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = {
      headers,
      responseType: 'blob' as const
    };
    return this._http.get(`${this._baseUrl}/pdf`, options);
  }

  exportToExcel() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = {
      headers,
      responseType: 'blob' as const
    };
    return this._http.get(`${this._baseUrl}/excel`, options);
  }

}
