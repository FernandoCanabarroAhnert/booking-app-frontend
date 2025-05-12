import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
      this.loginForm = this._fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this._authService.login(this.loginForm.value).subscribe({
      next: () => {
        this._router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        const AUTHORIZATION_ERROR = error.status === 401;
        const SERVER_ERROR = error.status === 500;
        if (AUTHORIZATION_ERROR) {
          this.loginForm.setErrors({ invalidCredentials: true })
        }
        if (SERVER_ERROR) {
          this.loginForm.setErrors({ serverError: true })
        }
      }
    });
  }

}
