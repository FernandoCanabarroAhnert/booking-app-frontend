import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IRegistrationRequest } from '../interfaces/register/register-request.interface';
import { ILoginRequest } from '../interfaces/login/login-request.interface';
import { ILoginResponse } from '../interfaces/login/login-response.interface';
import { jwtDecode } from 'jwt-decode';
import { IUserResponse } from '../interfaces/user/user-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authenticationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this._authenticationSubject.asObservable();

  private _isOnlyOperatorRole: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isOnlyOperatorRole$ = this._isOnlyOperatorRole.asObservable();

  private _isAdminRole: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isAdminRole$ = this._isAdminRole.asObservable();

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:8080/api/v1/auth';

  register(request: IRegistrationRequest): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/register`, request);
  }

  guestLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this.login('login', request, (response) => response);
  }

  adminLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this.login('login/admin', request, (response) => {
      const token: any = jwtDecode(response.token);
      const roles = token.authorities as string[];
      const isOnlyOperatorRole = roles.includes('ROLE_OPERATOR') && !roles.includes('ROLE_ADMIN');
      const isAdminRole = roles.includes('ROLE_ADMIN');
      if (isOnlyOperatorRole) {
        this._isOnlyOperatorRole.next(true);
      }
      if (isAdminRole) {
        this._isAdminRole.next(true);
      }
      return response;
    })
  }

  private login(path: string, request: ILoginRequest, callback: (response: ILoginResponse) => ILoginResponse): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/${path}`, request)
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          this._authenticationSubject.next(true);
          return callback(response);
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
    return this._http.get<void>(`${this._baseUrl}/token/validate`, { headers });
  }

  getMe(): Observable<IUserResponse> {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get<IUserResponse>(`${this._baseUrl}/me`, { headers });
  }

  verifyIfEmailIsAlreadyInUse(email: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-email`, { params: { email } });
  }

  verifyIfCPFIsAlreadyInUse(cpf: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-cpf`, { params: { cpf } });
  }

}
