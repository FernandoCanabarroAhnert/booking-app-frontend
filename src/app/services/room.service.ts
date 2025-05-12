import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomDetailResponse } from '../interfaces/room-detail-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:8080/api/v1/rooms';

  findById(id: number): Observable<IRoomDetailResponse> {
    return this._http.get<IRoomDetailResponse>(`${this.baseUrl}/${id}`);
  }

}
