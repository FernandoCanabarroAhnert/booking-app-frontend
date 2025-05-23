import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCardList } from '../types/credit-card-list.type';
import { IPageResponse } from '../interfaces/page/page-response.interface';
import { ICreditCardRequest } from '../interfaces/credit-card/credit-card-request.interface';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/credit-cards';

  getMyCreditCards( page: number, size: number): Observable<IPageResponse<CreditCardList>> {
    const accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this._http.get<IPageResponse<CreditCardList>>(`${this.baseUrl}/my-credit-cards`, { headers, params: { page: page - 1, size } });
  }

  addCreditCard(request: ICreditCardRequest): Observable<void> {
    const accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this._http.post<void>(`${this.baseUrl}`, request, { headers });
  }

  deleteCreditCard(creditCardId: number): Observable<void> {
    const accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this._http.delete<void>(`${this.baseUrl}/${creditCardId}`, { headers });
  }

}
