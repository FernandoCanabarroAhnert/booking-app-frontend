import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IRegistrationRequest } from '../interfaces/register-request.interface';
import { ILoginRequest } from '../interfaces/login-request.interface';
import { ILoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:8080/api/v1/auth';

  register(request: IRegistrationRequest): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/register`, request);
  }

  login(request: ILoginRequest): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/login`, request)
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          return response;
        })
      );
  }

  activateAccount(code: string): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/activate-account`, { code });
  }

  verifyIfEmailIsAlreadyInUse(email: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-email`, { params: { email } });
  }

  verifyIfCPFIsAlreadyInUse(cpf: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-cpf`, { params: { cpf } });
  }

}
