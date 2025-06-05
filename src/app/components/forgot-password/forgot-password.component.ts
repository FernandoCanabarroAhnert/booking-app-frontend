import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup = {} as FormGroup;

  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', Validators.required)
    })
  }

  get email(): FormControl {
    return this.forgotPasswordForm.get('email') as FormControl;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this._authService.forgotPassword(this.email.value).subscribe({
      next: () => {
        this._router.navigate(['/reset-password']);
      },
      error: (error: HttpErrorResponse) => {
        const NOT_FOUND_ERROR = error.status === 404;
        if (NOT_FOUND_ERROR) {
          this.email.setErrors({ notFound: true });
        }
        else {
          this.forgotPasswordForm.setErrors({ serverError: true });
        }
      }
    });
  }

}
