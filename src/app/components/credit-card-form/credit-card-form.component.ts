import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogRef } from '@angular/cdk/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';
import { ICreditCardRequest } from '../../interfaces/credit-card/credit-card-request.interface';
import { CreditCardService } from '../../services/credit-card.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    NgxMaskDirective
  ],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.scss'
})
export class CreditCardFormComponent implements OnInit {

  addCreditCardForm: FormGroup = {} as FormGroup;

  private readonly _creditCardService = inject(CreditCardService);
  private readonly _dialogRef = inject(DialogRef);
  private readonly _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
  }

  get holderName(): FormControl {
    return this.addCreditCardForm.get('holderName') as FormControl;
  }
  get cardNumber(): FormControl {
    return this.addCreditCardForm.get('cardNumber') as FormControl;
  }
  get cvv(): FormControl {
    return this.addCreditCardForm.get('cvv') as FormControl;
  }
  get expirationDate(): FormControl {
    return this.addCreditCardForm.get('expirationDate') as FormControl;
  }
  get brand(): FormControl {
    return this.addCreditCardForm.get('brand') as FormControl;
  }

  createForm() {
    this.addCreditCardForm = this._fb.group({
      holderName: ['', Validators.required],
      cardNumber: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      brand: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.addCreditCardForm.invalid) {
      this.addCreditCardForm.markAllAsTouched();
      return;
    }
    this._creditCardService.addCreditCard(this.createCreditCardRequest()).subscribe({
      next: () => {
        this._dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        const UNPROCESSABLE_ENTITY = error.status === 422;
        const SERVER_ERROR = error.status === 500; 
        if (UNPROCESSABLE_ENTITY) {
          this.addCreditCardForm.setErrors({ invalidData: true });
        }
        if (SERVER_ERROR) {
          this.addCreditCardForm.setErrors({ serverError: true });
        }
      }
    })
  }

  private createCreditCardRequest(): ICreditCardRequest {
    return {
      holderName: this.holderName.value,
      cardNumber: this.cardNumber.value,
      cvv: this.cvv.value,
      expirationDate: `${this.expirationDate.value.substring(2)}-${this.expirationDate.value.substring(0, 2)}`,
      brand: this.brand.value
    }
  }

}
