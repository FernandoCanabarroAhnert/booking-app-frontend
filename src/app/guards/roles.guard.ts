import { inject } from "@angular/core";
import { CanActivateFn, GuardResult, MaybeAsync, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const rolesGuard = (roles: string[]): CanActivateFn => {
    return (): MaybeAsync<GuardResult> => {
        const router = inject(Router);
        const hasRole = AuthService.obtainRolesFromToken().some(role => roles.includes(role));
        if (hasRole) {
            return true;
        } 
        else {
            router.navigate(['/forbidden']);
            return false;
        }
    }
}