import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomDetailResponse } from '../interfaces/room/room-detail-response.interface';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { RoomRatingList } from '../types/room-rating-list.type';
import { RoomList } from '../types/room-list.type';
import { APPLY_AUTH_TOKEN } from '../interceptors/auth.interceptor';
import { IRoomRatingRequest } from '../interfaces/room/room-rating-request.interface';
import { IRoomRatingResponse } from '../interfaces/room/room-rating-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl: string = 'https://booking-api.fernandocanabarrodev.tech/api/v1/rooms';

  findAllRoomsWithFilter(page: number, size: number, checkIn: string, 
                        checkOut: string, city: string = '', 
                        capacity: number = 1, types: string[] = [''],
                        hotelId: number | string = '',
                        sort: string = 'id,asc',
                        minPrice: number | string = '', maxPrice: number | string = ''): Observable<IPageResponse<RoomList>> {
    return this._http.get<IPageResponse<RoomList>>(
      `${this.baseUrl}/query`, 
      { params: { page: page - 1, size, sort, checkIn, checkOut, city, capacity, types, hotelId, minPrice, maxPrice },
        context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  findAllRooms(page: number, size: number, sort: string = 'id,asc'): Observable<IPageResponse<RoomList>> {
    return this._http.get<IPageResponse<RoomList>>(this.baseUrl, { params: { page: page - 1, size, sort }, 
      context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  findById(id: number): Observable<IRoomDetailResponse> {
    return this._http.get<IRoomDetailResponse>(`${this.baseUrl}/${id}`, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  createRoom(room: FormData): Observable<void> {
    return this._http.post<void>(this.baseUrl, room);
  }

  updateRoom(id: number, room: FormData): Observable<void> {
    return this._http.put<void>(`${this.baseUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteImages(imagesIds: number[]): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/images`, { params: { imagesIds } });
  }

  findAllRatingsByRoomId(id: number, page: number, size: number): Observable<IPageResponse<RoomRatingList>> {
    return this._http.get<IPageResponse<RoomRatingList>>(`${this.baseUrl}/${id}/ratings`, { params: { page: page - 1, size }, 
      context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  findMyRatings(page: number = 0, size: number = 9): Observable<IPageResponse<RoomRatingList>> {
    return this._http.get<IPageResponse<RoomRatingList>>(`${this.baseUrl}/my-ratings`, { params: { page: page - 1, size } });
  }

  findRatingById(ratingId: number): Observable<IRoomRatingResponse> {
    return this._http.get<IRoomRatingResponse>(`${this.baseUrl}/ratings/${ratingId}`);
  }

  addRating(roomId: number, request: IRoomRatingRequest): Observable<void> {
    return this._http.post<void>(`${this.baseUrl}/${roomId}/ratings`, request);
  }

  updateRating(ratingId: number, request: IRoomRatingRequest): Observable<void> {
    return this._http.put<void>(`${this.baseUrl}/ratings/${ratingId}`, request);
  }

  deleteRating(ratingId: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/ratings/${ratingId}`);
  }

  exportToPdf() {
    const options = { responseType: 'blob' as const };
    return this._http.get(`${this.baseUrl}/pdf`, options);
  }

  exportToPdfGroupByHotel() {
    const options = { responseType: 'blob' as const };
    return this._http.get(`${this.baseUrl}/pdf/group-by-hotel`, options);
  }

  exportToExcel() {
    const options = { responseType: 'blob' as const };
    return this._http.get(`${this.baseUrl}/excel`, options);
  }

}
