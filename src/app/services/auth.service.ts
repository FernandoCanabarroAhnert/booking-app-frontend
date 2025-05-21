import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IRegistrationRequest } from '../interfaces/register-request.interface';
import { ILoginRequest } from '../interfaces/login-request.interface';
import { ILoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authenticationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this._authenticationSubject.asObservable();

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:8080/api/v1/auth';

  register(request: IRegistrationRequest): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/register`, request);
  }

  guestLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/login`, request)
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          this._authenticationSubject.next(true);
          return response;
        })
      );
  }

  adminLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/login/admin`, request)
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          this._authenticationSubject.next(true);
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem('access-token');
    this._authenticationSubject.next(false);
  }

  activateAccount(code: string): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/activate-account`, { code });
  }

  validateJWTToken(): Observable<void> {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get<void>(`${this._baseUrl}/auth/token/validate`, { headers });
  }

  verifyIfEmailIsAlreadyInUse(email: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-email`, { params: { email } });
  }

  verifyIfCPFIsAlreadyInUse(cpf: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-cpf`, { params: { cpf } });
  }

}
