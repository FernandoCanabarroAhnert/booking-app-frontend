import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { UserList } from '../types/user-list.type';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { ICreateUserRequest } from '../interfaces/user/create-user-request.interface';
import { Observable } from 'rxjs';
import { IUpdateUserRequest } from '../interfaces/user/update-user-request.interface';
import { IUserSearchResponse } from '../interfaces/user/user-search-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'https://booking-api.fernandocanabarrodev.tech/api/v1/users';

  findAllByCpf(cpf: string): Observable<IUserSearchResponse[]> {
    return this._http.get<IUserSearchResponse[]>(`${this._baseUrl}/search`, { params: { cpf } });
  }

  findAllUsers(page: number = 1, size: number = 10, fullName: string = ''): Observable<IPageResponse<UserList>> {
    return this._http.get<IPageResponse<UserList>>(this._baseUrl, { params: { page: page - 1, size, fullName } });
  }

  findById(id: number): Observable<IUserResponse> {
    return this._http.get<IUserResponse>(`${this._baseUrl}/${id}`);
  }

  createUser(request: ICreateUserRequest): Observable<void> {
    return this._http.post<void>(this._baseUrl, request);  
  }

  updateUser(id: number, request: IUpdateUserRequest): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/${id}`, request);
  }

  exportToPdf(): Observable<Blob> {
    return this._http.get(`${this._baseUrl}/pdf`, { responseType: 'blob' });
  }

  exportToExcel(): Observable<Blob> {
    return this._http.get(`${this._baseUrl}/excel`, { responseType: 'blob' });
  }

}
