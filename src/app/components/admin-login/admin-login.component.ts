import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatTooltipModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {

  adminLoginForm: FormGroup = {} as FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.adminLoginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get email(): FormControl {
    return this.adminLoginForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.adminLoginForm.get('password') as FormControl;
  }

  onSubmit() {
    if (this.adminLoginForm.invalid) {
      this.adminLoginForm.markAllAsTouched();
      return;
    }
    this._authService.adminLogin(this.adminLoginForm.value).subscribe({
      next: () => this._router.navigate(['/admin']),
      error: (error: HttpErrorResponse) => {
        const AUTHORIZATION_ERROR = error.status === 401;
        const ACCOUNT_NOT_ACTIVATED = error.status === 403 && error.error.message.includes('not activated');
        const USER_IS_NOT_ADMIN = error.status === 403 && error.error.message.includes('User does not have permission');
        const SERVER_ERROR = error.status === 500;
        if (AUTHORIZATION_ERROR) {
          this.adminLoginForm.setErrors({ invalidCredentials: true });
        }
        if (ACCOUNT_NOT_ACTIVATED) {
          this.adminLoginForm.setErrors({ accountNotActivated: true });
        }
        if (USER_IS_NOT_ADMIN) {
          this.adminLoginForm.setErrors({ userIsNotAdmin: true });
        }
        if (SERVER_ERROR) {
          this.adminLoginForm.setErrors({ serverError: true });
        }
      }
    })
  }

}
