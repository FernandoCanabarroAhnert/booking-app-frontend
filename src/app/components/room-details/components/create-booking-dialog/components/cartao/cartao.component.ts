import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CreditCardService } from '../../../../../../services/credit-card.service';
import { map, Observable } from 'rxjs';
import { CreditCardList } from '../../../../../../types/credit-card-list.type';
import { CommonModule } from '@angular/common';
import { CreditCardComponent } from '../../../../../credit-card/credit-card.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICreditCardRequest } from '../../../../../../interfaces/credit-card/credit-card-request.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { PaginationComponent } from '../../../../../pagination/pagination.component';
import { IPageResponse } from '../../../../../../interfaces/page/page-response.interface';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [
    CommonModule,
    CreditCardComponent,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatIcon,
    MatRadioModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './cartao.component.html',
  styleUrl: './cartao.component.scss'
})
export class CartaoComponent implements OnInit, OnChanges {

  @Output()
  selectedCreditCardEmitter = new EventEmitter<number>();
  @Output()
  selectedInstallmentQuantityEmitter = new EventEmitter<number>();
  @Input({ required: true })
  totalPrice!: number;

  private readonly _creditCardService = inject(CreditCardService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _fb = inject(FormBuilder);

  creditCards$!: Observable<IPageResponse<CreditCardList>>;
  installments!: Map<number, number>;
  isAddCreditCardExpansionOpen = false;

  addCreditCardForm: FormGroup = this._fb.group({
    holderName: ['', Validators.required],
    cardNumber: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
    expirationDate: ['', [Validators.required]],
    brand: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.getMyCreditCards();
    this.setupInstallments();
    this.instantiateAddCreditCardForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPrice']) {
      this.setupInstallments();
    }
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

  selectedCreditCardEmit(creditCardId: number) {
    this.selectedCreditCardEmitter.emit(creditCardId);
  }

  selectedInstallmentQuantityEmit(event: MatOptionSelectionChange<number>) {
    if (event.isUserInput) {
      this.selectedInstallmentQuantityEmitter.emit(event.source.value);
    }
  }

  onPageChange(page: number) {
    this.getMyCreditCards(page);
  }

  onSubmit() {
    if (this.addCreditCardForm.invalid) {
      this.addCreditCardForm.markAllAsTouched();
      return;
    }
    this._creditCardService.addCreditCard(this.createCreditCardRequest()).subscribe({
      next: () => {
        this.isAddCreditCardExpansionOpen = false;
        this.getMyCreditCards();
        this.setupInstallments();
        this.addCreditCardForm.reset();
        this._snackBarService.showSnackBar('Cartão adicionado com sucesso!', 'Fechar');
      },
      error: (error: HttpErrorResponse) => {
        const BAD_REQUEST = error.status === 400;
        const UNPROCESSABLE_ENTITY = error.status === 422;
        const SERVER_ERROR = error.status === 500; 
        if (BAD_REQUEST) {
          this.expirationDate.setErrors({ invalidFormat: true });
        }
        if (UNPROCESSABLE_ENTITY) {
          this.addCreditCardForm.setErrors({ invalidData: true });
        }
        if (SERVER_ERROR) {
          this.addCreditCardForm.setErrors({ serverError: true });
        }
      }
    })
  }

  private getMyCreditCards(page: number = 1, size: number = 1): void {
    this.creditCards$ = this._creditCardService.getMyCreditCards(page, size);
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

  private setupInstallments(): void {
    this.installments = new Map<number, number>([
      [1, this.totalPrice / 1],
      [2, this.totalPrice / 2],
      [3, this.totalPrice / 3],
      [4, this.totalPrice / 4],
      [5, this.totalPrice / 5]
    ]);
  }

  private instantiateAddCreditCardForm() {
    this.addCreditCardForm = this._fb.group({
      holderName: ['', Validators.required],
      cardNumber: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      brand: [null, [Validators.required]]
    })
  }

}
