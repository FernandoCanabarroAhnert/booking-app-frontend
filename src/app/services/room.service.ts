import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomDetailResponse } from '../interfaces/room/room-detail-response.interface';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { RoomRatingList } from '../types/room-rating-list.type';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:8080/api/v1/rooms';

  findById(id: number): Observable<IRoomDetailResponse> {
    return this._http.get<IRoomDetailResponse>(`${this.baseUrl}/${id}`);
  }

  findAllRatingsByRoomId(id: number, page: number, size: number): Observable<IPageResponse<RoomRatingList>> {
    return this._http.get<IPageResponse<RoomRatingList>>(`${this.baseUrl}/${id}/ratings`, { params: { page: page - 1, size } });
  }

}
