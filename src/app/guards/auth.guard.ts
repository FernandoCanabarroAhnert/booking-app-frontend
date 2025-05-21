import { inject } from "@angular/core";
import { CanActivateFn, GuardResult, MaybeAsync, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map } from "rxjs";

export const authGuard = (): CanActivateFn => {
    return (): MaybeAsync<GuardResult> => {
        const authService = inject(AuthService);
        const router = inject(Router);
        return authService.validateJWTToken()
            .pipe(
                catchError(() => {
                    router.navigate(['/login']);
                    return [false]
                }),
                map(() => true)
            )
    }
}