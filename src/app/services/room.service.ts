import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomDetailResponse } from '../interfaces/room/room-detail-response.interface';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { RoomRatingList } from '../types/room-rating-list.type';
import { RoomList } from '../types/room-list.type';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:8080/api/v1/rooms';

  findAllRooms(page: number, size: number): Observable<IPageResponse<RoomList>> {
    return this._http.get<IPageResponse<RoomList>>(this.baseUrl, { params: { page: page - 1, size } });
  }

  findById(id: number): Observable<IRoomDetailResponse> {
    return this._http.get<IRoomDetailResponse>(`${this.baseUrl}/${id}`);
  }

  findAllRatingsByRoomId(id: number, page: number, size: number): Observable<IPageResponse<RoomRatingList>> {
    return this._http.get<IPageResponse<RoomRatingList>>(`${this.baseUrl}/${id}/ratings`, { params: { page: page - 1, size } });
  }

  createRoom(room: FormData): Observable<void> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`); 
    return this._http.post<void>(this.baseUrl, room, { headers });
  }

  updateRoom(id: number, room: FormData): Observable<void> {
    const headers = new HttpHeaders().set('authorization', `Bearer ${localStorage.getItem('access-token')}`); 
    return this._http.put<void>(`${this.baseUrl}/${id}`, room, { headers });
  }

  exportToPdf() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = { headers, responseType: 'blob' as const };
    return this._http.get(`${this.baseUrl}/pdf`, options);
  }

  exportToExcel() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    const options = { headers, responseType: 'blob' as const };
    return this._http.get(`${this.baseUrl}/excel`, options);
  }

}
