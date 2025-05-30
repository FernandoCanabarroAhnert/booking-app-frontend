import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../../../services/auth.service';
import { passwordConfirmationValidator } from '../../../../validators/password-confirmation.validator';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordValidator } from '../../../../validators/password.validator';
import { Router } from '@angular/router';
import { IUserSelfUpdateInfosRequest } from '../../../../interfaces/user/user-self-update-infos.interface';

@Component({
  selector: 'app-user-infos',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-infos.component.html',
  styleUrl: './user-infos.component.scss'
})
export class UserInfosComponent implements OnInit {

  updateInfosForm!: FormGroup;
  updatePasswordForm!: FormGroup;

  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly _authService = inject(AuthService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createUpdateInfosForm();
    this.createUpdatePasswordForm();
  }

  get fullName(): FormControl {
    return this.updateInfosForm.get('fullName') as FormControl;
  }
  get email(): FormControl {
    return this.updateInfosForm.get('email') as FormControl;
  }
  get phone(): FormControl {
    return this.updateInfosForm.get('phone') as FormControl;
  }

  get currentPassword(): FormControl {
    return this.updatePasswordForm.get('currentPassword') as FormControl;
  }
  get password(): FormControl {
    return this.updatePasswordForm.get('password') as FormControl;
  }
  get passwordConfirmation(): FormControl {
    return this.updatePasswordForm.get('passwordConfirmation') as FormControl;
  }

  createUpdateInfosForm() {
    this._authService.getMe().subscribe(user => {
      const birthDate = `${user.birthDate.substring(8)}/${user.birthDate.substring(5, 7)}/${user.birthDate.substring(0, 4)}`;
      this.updateInfosForm = this._fb.group({
        fullName: [user.fullName, [Validators.required]],
        email: [user.email, [Validators.required, Validators.pattern(this.emailPattern)]],
        phone: [user.phone, Validators.required],
      });
      this.updateInfosForm.updateValueAndValidity();
    })
  }

  createUpdatePasswordForm() {
    this.updatePasswordForm = this._fb.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
      passwordConfirmation: ['', [Validators.required]]
    });
    this.updatePasswordForm.addValidators(passwordConfirmationValidator());
  }

  onUpdateInfosFormSubmit() {
    if (this.updateInfosForm.invalid) {
      this.updateInfosForm.markAllAsTouched();
      return;
    }
    const phone = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(this.phone.value.trim()) ? this.phone.value : `(${this.phone.value.substring(0,2)}) ${this.phone.value.substring(2, 7)}-${this.phone.value.substring(7)}`;
    const request: IUserSelfUpdateInfosRequest = {
      fullName: this.fullName.value,
      email: this.email.value,
      phone: phone,
    };
    this._authService.userSelfUpdateInfos(request).subscribe({
      next: () => {
        this._authService.logout();
        this._router.navigate(['/login']);
        this._snackBarService.showSnackBar('Informações atualizadas com sucesso!', 'Fechar');
      },
      error: (error: HttpErrorResponse) => {
        const ALREADY_EXISTING_EMAIL = error.status === 409 && error.error.message.includes('E-mail');
        const INVALID_DATA = error.status === 422;
        const INTERNAL_SERVER_ERROR = error.status === 500;
        if (ALREADY_EXISTING_EMAIL) {
          this.email.setErrors({ emailIsAlreadyInUse: true });
        }
        if (INVALID_DATA) {
          this.updateInfosForm.setErrors({ invalidData: true });
        }
        if (INTERNAL_SERVER_ERROR) {
          this.updateInfosForm.setErrors({ serverError: true });
        }
      }
    })
  } 

  onUpdatePasswordFormSubmit() {
    if (this.updatePasswordForm.invalid) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }
    const request = {
      currentPassword: this.currentPassword.value,
      password: this.password.value
    };
    this._authService.userSelfUpdatePassword(request).subscribe({
      next: () => {
        this._authService.logout();
        this._router.navigate(['/login']);
        this._snackBarService.showSnackBar('Senha atualizada com sucesso!', 'Fechar');
      },
      error: (error: HttpErrorResponse) => {
        const INVALID_CURRENT_PASSWORD = error.status === 409;
        const INVALID_DATA = error.status === 422;
        const INTERNAL_SERVER_ERROR = error.status === 500;
        if (INVALID_CURRENT_PASSWORD) {
          this.currentPassword.setErrors({ invalidCurrentPassword: true });
        }
        if (INVALID_DATA) {
          this.updatePasswordForm.setErrors({ invalidData: true });
        }
        if (INTERNAL_SERVER_ERROR) {
          this.updatePasswordForm.setErrors({ serverError: true });
        }
      }
    });
  }

}
