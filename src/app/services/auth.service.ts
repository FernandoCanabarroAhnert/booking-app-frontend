import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IRegistrationRequest } from '../interfaces/register/register-request.interface';
import { ILoginRequest } from '../interfaces/login/login-request.interface';
import { ILoginResponse } from '../interfaces/login/login-response.interface';
import { jwtDecode } from 'jwt-decode';
import { IUserResponse } from '../interfaces/user/user-response.interface';
import { IUserSelfUpdatePasswordRequest } from '../interfaces/user/user-self-update-password.interface';
import { IUserSelfUpdateInfosRequest } from '../interfaces/user/user-self-update-infos.interface';
import { APPLY_AUTH_TOKEN } from '../interceptors/auth.interceptor';
import { INewPasswordRequest } from '../interfaces/user/new-password-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'https://booking-api.fernandocanabarrodev.tech/api/v1/auth';

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access-token');
    return token ? true : false;
  }

  static isAdmin(): boolean {
    return this.obtainRolesFromToken().includes('ROLE_ADMIN');
  }

  static isOnlyOperator(): boolean {
    return this.obtainRolesFromToken().includes('ROLE_OPERATOR') && !this.obtainRolesFromToken().includes('ROLE_ADMIN');
  }

  static hasManagementPermission(): boolean {
    return this.obtainRolesFromToken().includes('ROLE_ADMIN') || this.obtainRolesFromToken().includes('ROLE_OPERATOR');
  }

  static obtainRolesFromToken(): string[] {
    const token = localStorage.getItem('access-token');
    if (!token) return [];
    const decodedToken: any = jwtDecode(token as string);
    return decodedToken.authorities as string[];
  }

  register(request: IRegistrationRequest): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/register`, request, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  guestLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this.login('login', request);
  }

  adminLogin(request: ILoginRequest): Observable<ILoginResponse> {
    return this.login('login/admin', request)
  }

  private login(path: string, request: ILoginRequest): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/${path}`, request, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) })
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem('access-token');
  }

  activateAccount(code: string): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/activate-account`, { code }, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  validateJWTToken(): Observable<void> {
    return this._http.get<void>(`${this._baseUrl}/token/validate`);
  }

  getMe(): Observable<IUserResponse> {
    return this._http.get<IUserResponse>(`${this._baseUrl}/me`);
  }

  userSelfUpdateInfos(request: IUserSelfUpdateInfosRequest): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/profile`, request);
  }

  userSelfUpdatePassword(request: IUserSelfUpdatePasswordRequest): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/profile/password`, request);
  }

  forgotPassword(email: string): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/forgot-password`, { email }, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  resetPassword(request: INewPasswordRequest): Observable<void> {
    return this._http.put<void>(`${this._baseUrl}/reset-password`, request, { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

  verifyIfEmailIsAlreadyInUse(email: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-email`, { params: { email }, context: new HttpContext().set(APPLY_AUTH_TOKEN, false) },);
  }

  verifyIfCPFIsAlreadyInUse(cpf: string): Observable<{ alreadyExists: boolean }> {
    return this._http.get<{ alreadyExists: boolean }>(`${this._baseUrl}/verify-cpf`, { params: { cpf }, context: new HttpContext().set(APPLY_AUTH_TOKEN, false) });
  }

}
