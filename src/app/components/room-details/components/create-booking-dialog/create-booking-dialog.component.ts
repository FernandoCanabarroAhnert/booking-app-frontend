import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, MatStepperModule } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { paymentTypeEnumMap } from '../../../../utils/payment-type-enum-map';
import { PaymentTypePipe } from '../../../../pipes/payment-type.pipe';
import { PixComponent } from './components/pix/pix.component';
import { BoletoComponent } from './components/boleto/boleto.component';
import { BookingService } from '../../../../services/booking.service';
import { CartaoComponent } from './components/cartao/cartao.component';

@Component({
  selector: 'app-create-booking-dialog',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    PaymentTypePipe,
    PixComponent,
    BoletoComponent,
    CartaoComponent
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './create-booking-dialog.component.html',
  styleUrl: './create-booking-dialog.component.scss'
})
export class CreateBookingDialogComponent implements OnInit {

  private readonly _bookingService = inject(BookingService);
  private readonly _dialogRef = inject(MatDialogRef<CreateBookingDialogComponent>);
  private _fb = inject(FormBuilder);

  readonly data = inject(MAT_DIALOG_DATA);

  today = new Date(new Date().setHours(0, 0, 0, 0));
  milisecondsInDay = 86400000;
  checkOutMinDate = new Date(this.today.getTime() + this.milisecondsInDay);
  unavailableDates: Date[] = this.data.unavailableDates;

  dateFilter = (d: Date | null): boolean => {
    const day = d || new Date();
    return this.unavailableDates && !this.unavailableDates.some(dateStr => {
      const date = new Date(new Date(dateStr).getTime() + this.milisecondsInDay);
      return (
        date.getDate() === day.getDate() &&
        date.getMonth() === day.getMonth() &&
        date.getFullYear() === day.getFullYear()
      );
    });
  };

  checkin!: Date;
  checkout!: Date;
  capacityOptions!: number[];

  bookingData = this._fb.group({
    checkIn: [this.data.checkIn, Validators.required],
    checkOut: [this.data.checkOut, Validators.required],
    guestsQuantity: [this.data.guestsQuantity, Validators.required]
  });
  paymentData = this._fb.group({
    paymentType: [null, Validators.required],
    isOnlinePayment: [false],
    creditCardId: [null as number | null],
    installmentQuantity: [null as number | null]
  });

  stepperOrientation: Observable<StepperOrientation>;
  
  paymentKeys = Object.keys(paymentTypeEnumMap).map(Number);

  ngOnInit(): void {
      this.checkin = this.data.checkIn;
      this.checkout = this.data.checkOut;
      this.capacityOptions = this.data.capacityOptions;
  }

  constructor() {
    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  get nights(): number {
    const diff = this.bookingData.value.checkOut!.getTime() - this.bookingData.value.checkIn!.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  get totalPrice(): number {
    return this.nights * this.data.pricePerNight;
  }
  get checkIn(): FormControl {
      return this.bookingData.get('checkIn') as FormControl;
  }
  get checkOut(): FormControl {
    return this.bookingData.get('checkOut') as FormControl;
  }
  get guestsQuantity(): FormControl {
    return this.bookingData.get('guestsQuantity') as FormControl;
  }
  get paymentType(): FormControl {
    return this.paymentData.get('paymentType') as FormControl;
  }
  get isOnlinePayment(): FormControl {
    return this.paymentData.get('isOnlinePayment') as FormControl;
  }
  get installmentQuantity(): FormControl {
    return this.paymentData.get('installmentQuantity') as FormControl;
  }
  get creditCardId(): FormControl {
    return this.paymentData.get('creditCardId') as FormControl;
  }

  onCheckInChange(event: MatDatepickerInputEvent<Date>) {
      this.checkOutMinDate = new Date(this.bookingData.value.checkIn!.getTime() + this.milisecondsInDay);
      if (event.value && this.bookingData.value.checkOut) {
        if (event.value.getTime() >= this.bookingData.value.checkOut.getTime()) {
          this.bookingData.patchValue({ checkOut: new Date(event.value.getTime() + this.milisecondsInDay)});
        }
      }
      this.validateCheckInAndCheckOut();
    }
  
  onCheckOutChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.bookingData.value.checkIn!.getTime() + this.milisecondsInDay);
    if (event.value && this.bookingData.value.checkIn) {
      if (event.value.getTime() < this.bookingData.value.checkIn.getTime()) {
        this.bookingData.patchValue({ checkOut: this.bookingData.value.checkIn, checkIn: event.value });
      }
    }
    this.validateCheckInAndCheckOut();
  }

  closeDialog() {
    this.validateCheckInAndCheckOut();
    if (this.paymentType.value === 2) {
      if (!this.installmentQuantity.value) {
        this.paymentData.setErrors({ requiredInstallmentQuantity: true });
        return;
      }
      if (!this.creditCardId.value) {
        this.paymentData.setErrors({ requiredCreditCard: true });
        return;
      }
    }
    if (this.bookingData.invalid || this.paymentData.invalid) {
      if (this.bookingData.invalid) {
        this.bookingData.markAllAsTouched();
        this.bookingData.setErrors({ invalidData: true });
      }
      if (this.paymentData.invalid) {
        this.paymentData.markAllAsTouched();
        this.paymentData.setErrors({ invalidData: true });
      }
      return;
    }
    this._dialogRef.close({ bookingData: this.bookingData.value, paymentData: this.paymentData.value });
  }

  printBoleto() {
    this._bookingService.printBoleto(this.totalPrice).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  onCreditCardSelected(creditCardId: number) {
    this.paymentData.patchValue({ creditCardId });
  }

  onInstallmentQuantitySelected(installmentQuantity: number) {
    this.paymentData.patchValue({ installmentQuantity });
  }

  private validateCheckInAndCheckOut() {
    this.unavailableDates.map(dateStr => new Date(dateStr)).some(date => {
      const invalidDate = this.checkIn.value <= date && this.checkOut.value >= date;
      if (invalidDate) {
        this.checkIn.setErrors({ matDatepickerFilter: true });
        this.checkOut.setErrors({ matDatepickerFilter: true });
      }
    });
  }

}
