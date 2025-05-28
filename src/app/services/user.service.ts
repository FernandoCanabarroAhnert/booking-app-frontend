import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private readonly _baseUrl = 'http://localhost:8080/api/v1/users';

  findAllByCpf(cpf: string): Observable<IUserSearchResponse[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IUserSearchResponse[]>(`${this._baseUrl}/search`, { params: { cpf }, headers });
  }

  findAllUsers(page: number = 1, size: number = 10, fullName: string = ''): Observable<IPageResponse<UserList>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IPageResponse<UserList>>(this._baseUrl, { headers, params: { page: page - 1, size, fullName } });
  }

  findById(id: number): Observable<IUserResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get<IUserResponse>(`${this._baseUrl}/${id}`, { headers });
  }

  createUser(request: ICreateUserRequest): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.post<void>(this._baseUrl, request, { headers });  
  }

  updateUser(id: number, request: IUpdateUserRequest): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.put<void>(`${this._baseUrl}/${id}`, request, { headers });
  }

  exportToPdf(): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get(`${this._baseUrl}/pdf`, { headers, responseType: 'blob' });
  }

  exportToExcel(): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access-token')}`);
    return this._http.get(`${this._baseUrl}/excel`, { headers, responseType: 'blob' });
  }

}
