import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent implements OnInit {

  activateAccountForm: FormGroup = {} as FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.activateAccountForm = this._fb.group({
      code: ['', Validators.required]
    });
  }

  get code(): FormControl {
    return this.activateAccountForm.get('code') as FormControl;
  }

  onSubmit(): void {
    if (this.activateAccountForm.invalid) {
      this.activateAccountForm.markAllAsTouched();
      return;
    }
    this._authService.activateAccount(this.code.value).subscribe({
      next: () => this._router.navigate(['/login']),
      error: (error: HttpErrorResponse) => {
        const CODE_NOT_FOUND_ERROR = error.status === 404 && error.error.message.includes('Activation code');
        const USER_NOT_FOUND_ERROR = error.status === 404 && error.error.message.includes('User');
        const SERVER_ERROR = error.status === 500;
        if (CODE_NOT_FOUND_ERROR) {
          this.code.setErrors({ codeNotFound: true });
        }
        if (USER_NOT_FOUND_ERROR) {
          this.code.setErrors({ userNotFound: true });
        }
        if (SERVER_ERROR) {
          this.activateAccountForm.setErrors({ serverError: true });
        }
      }
    })
  }

}
