import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, delay, finalize, Observable, throwError } from "rxjs";
import { LoadingService } from "../services/loading.service";

export function loadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const loadingService = inject(LoadingService);
    loadingService.setLoading(req.url, true);
    return next(req)
        .pipe(
            catchError(error => {
                loadingService.setLoading(req.url, false);
                return throwError(() => error);
            }),
            finalize(() => {
                loadingService.setLoading(req.url, false);
            })
        )
}