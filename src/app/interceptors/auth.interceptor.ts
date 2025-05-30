import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export const APPLY_AUTH_TOKEN = new HttpContextToken<boolean>(() => true);

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if (!request.context.get(APPLY_AUTH_TOKEN)) {
        return next(request);
    }
    else {
        const accessToken = localStorage.getItem('access-token');
        if (!accessToken) {
            return throwError(() => new HttpErrorResponse({ status: 401 }));
        }
        const requestWithAuthHeader = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        return next(requestWithAuthHeader);
    }
}