import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { passwordValidator } from '../../validators/password.validator';
import { passwordConfirmationValidator } from '../../validators/password-confirmation.validator';
import { INewPasswordRequest } from '../../interfaces/user/new-password-request.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup = {} as FormGroup;

  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.resetPasswordForm = this._fb.group({
      code: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
      passwordConfirmation: ['', Validators.required]
    });
    this.resetPasswordForm.addValidators(passwordConfirmationValidator());
  }

  get code(): FormControl {
    return this.resetPasswordForm.get('code') as FormControl;
  }
  get password(): FormControl {
    return this.resetPasswordForm.get('password') as FormControl;
  }
  get passwordConfirmation(): FormControl {
    return this.resetPasswordForm.get('passwordConfirmation') as FormControl;
  }

  onSubmit() {
    const request: INewPasswordRequest = {
      code: this.code.value,
      password: this.password.value
    }
    this._authService.resetPassword(request).subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        const EXPIRED_CODE_ERROR = error.status === 400;
        const NOT_FOUND_ERROR = error.status === 404;
        const INVALID_DATA = error.status === 422;
        const SERVER_ERROR = error.status === 500;
        if (EXPIRED_CODE_ERROR) {
          this.code.setErrors({ expired: true });
        }
        if (NOT_FOUND_ERROR) {
          this.code.setErrors({ notFound: true });
        }
        if (INVALID_DATA) {
          this.resetPasswordForm.setErrors({ invalidData: true });
        }
        if (SERVER_ERROR) {
          this.resetPasswordForm.setErrors({ serverError: true });
        }
      }
    })
  }

}
