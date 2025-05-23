import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IViaCepResponse } from '../interfaces/via-cep/via-cep-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  private readonly _http = inject(HttpClient);
  private readonly _url = 'https://viacep.com.br/ws';

  getAddressInfos(zipCode: string): Observable<IViaCepResponse> {
    return this._http.get<IViaCepResponse>(`${this._url}/${zipCode}/json/`);
  }

}
