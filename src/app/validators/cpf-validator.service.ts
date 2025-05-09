import { inject, Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { map, Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class CpfValidatorService implements AsyncValidator {

    private readonly _authService = inject(AuthService);

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        if (!control.dirty) return of(null);
        const cpf = `${control.value.substring(0,3)}.${control.value.substring(3,6)}.${control.value.substring(6,9)}-${control.value.substring(9)}`;
        return this._authService.verifyIfCPFIsAlreadyInUse(cpf)
            .pipe(
                map((response) => response.alreadyExists ? { cpfIsAlreadyInUse: true } : null)
            );
    }

}