import { HttpClient } from '@angular/common/http';
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
    return this._http.get<IPageResponse<CreditCardList>>(`${this.baseUrl}/my-credit-cards`, { params: { page: page - 1, size } });
  }

  addCreditCard(request: ICreditCardRequest): Observable<void> {
    return this._http.post<void>(`${this.baseUrl}`, request);
  }

  deleteCreditCard(creditCardId: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${creditCardId}`);
  }

}
