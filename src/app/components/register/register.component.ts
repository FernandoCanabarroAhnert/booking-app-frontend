import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { EmailValidatorService } from '../../validators/email-validator.service';
import { CpfValidatorService } from '../../validators/cpf-validator.service';
import { passwordValidator } from '../../validators/password.validator';
import { passwordConfirmationValidator } from '../../validators/password-confirmation.validator';
import { CommonModule } from '@angular/common';
import { IRegistrationRequest } from '../../interfaces/register/register-request.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly _fb = inject(FormBuilder);
  private readonly _emailValidator = inject(EmailValidatorService);
  private readonly _cpfValidator = inject(CpfValidatorService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
      this.registerForm = this._fb.group({
        fullName: ['', Validators.required],
        email: ['', { 
          validators: [Validators.required, Validators.pattern(this.emailPattern)], 
          asyncValidators: [this._emailValidator.validate.bind(this._emailValidator)],
          updateOn: 'blur'  }],
        cpf: ['', {
          validators: [Validators.required],
          asyncValidators: [this._cpfValidator.validate.bind(this._cpfValidator)],
          updateOn: 'blur'
        }],
        birthDate: ['', Validators.required],
        phone: ['', Validators.required],
        password: ['', { validators: [Validators.required, Validators.minLength(8), passwordValidator()] }],
        passwordConfirmation: ['', { validators: [Validators.required] }],
      });
      this.registerForm.addValidators(passwordConfirmationValidator());
  }

  get fullName(): FormControl {
    return this.registerForm.get('fullName') as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get cpf(): FormControl {
    return this.registerForm.get('cpf') as FormControl;
  }
  get birthDate(): FormControl {
    return this.registerForm.get('birthDate') as FormControl;
  }
  get phone(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get passwordConfirmation(): FormControl {
    return this.registerForm.get('passwordConfirmation') as FormControl;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const cpfValue = `${this.cpf.value.substring(0,3)}.${this.cpf.value.substring(3,6)}.${this.cpf.value.substring(6,9)}-${this.cpf.value.substring(9)}`;
    const birthDateValue = `${this.birthDate.value.substring(4)}-${this.birthDate.value.substring(2,4)}-${this.birthDate.value.substring(0,2)}`;
    const request: IRegistrationRequest = {
      fullName: this.fullName.value,
      email: this.email.value,
      cpf: cpfValue,
      birthDate: birthDateValue,
      phone: this.phone.value,
      password: this.password.value,
    }
    this._authService.register(request).subscribe({
      next: () => this._router.navigate(['/activate-account']),
      error: (error: HttpErrorResponse) => {
        const EMAIL_ALREADY_IN_USE_ERROR = error.status === 409 && error.error.message.includes('E-mail');
        const CPF_ALREADY_IN_USE_ERROR = error.status === 409 && error.error.message.includes('CPF');
        const INVALID_DATA_ERROR = error.status === 422;
        const SERVER_ERROR = error.status === 500;
        if (EMAIL_ALREADY_IN_USE_ERROR) {
          this.email.setErrors({ emailIsAlreadyInUse: true });
        }
        if (CPF_ALREADY_IN_USE_ERROR) {
          this.cpf.setErrors({ cpfIsAlreadyInUse: true });
        }
        if (INVALID_DATA_ERROR) {
          this.registerForm.setErrors({ invalidData: true });
        }
        if (SERVER_ERROR) {
          this.registerForm.setErrors({ serverError: true });
        }
      }
    });
  }

}
