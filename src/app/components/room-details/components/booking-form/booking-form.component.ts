import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateBookingDialogComponent } from '../create-booking-dialog/create-booking-dialog.component';
import { BookingService } from '../../../../services/booking.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ICreateBooking } from '../../../../interfaces/booking/create-booking.interface';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {

  _capacity: number = 1;

  @Input({ required: true })
  roomId!: number;
  @Input({ required: true })
  pricePerNight!: number;
  @Input({ required: true })
  set capacity(value: number) {
    this._capacity = value;
    this.capacityOptions = Array.from({ length: this._capacity }, (_, i) => i + 1);
  }
  @Input({ required: true })
  unavailableDates!: Date[];

  private readonly _bookingService = inject(BookingService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _snackBarService = inject(SnackBarService);

  today = new Date(new Date().setHours(0, 0, 0, 0));
  milisecondsInDay = 86400000;
  checkOutMinDate = new Date(this.today.getTime() + this.milisecondsInDay);

  bookingForm = new FormGroup({
    checkIn: new FormControl<Date | null>(this.today),
    checkOut: new FormControl<Date | null>(new Date(this.today.getTime() + this.milisecondsInDay)),
    guestsQuantity: new FormControl(1, [Validators.required])
  });

  capacityOptions = Array.from({ length: this._capacity }, (_, i) => i + 1);

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

  get nights(): number {
    const diff = this.bookingForm.value.checkOut!.getTime() - this.bookingForm.value.checkIn!.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  get totalPrice(): number {
    return this.nights * this.pricePerNight;
  }
  get checkIn(): FormControl {
    return this.bookingForm.get('checkIn') as FormControl;
  }
  get checkOut(): FormControl {
    return this.bookingForm.get('checkOut') as FormControl;
  }
  get guestsQuantity(): FormControl {
    return this.bookingForm.get('guestsQuantity') as FormControl;
  }

  onCheckInChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.bookingForm.value.checkIn!.getTime() + this.milisecondsInDay);
    if (event.value && this.bookingForm.value.checkOut) {
      if (event.value.getTime() >= this.bookingForm.value.checkOut.getTime()) {
        this.bookingForm.patchValue({ checkOut: new Date(event.value.getTime() + this.milisecondsInDay)});
      }
    }
  }

  onCheckOutChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.bookingForm.value.checkIn!.getTime() + this.milisecondsInDay);
    if (event.value && this.bookingForm.value.checkIn) {
      if (event.value.getTime() < this.bookingForm.value.checkIn.getTime()) {
        this.bookingForm.patchValue({ checkOut: this.bookingForm.value.checkIn, checkIn: event.value });
      }
    }
  }

  openDialog() {
    const isLoggedId = AuthService.isAuthenticated();
    if (!isLoggedId) {
      this._snackBarService.showSnackBar('Você precisa estar logado para fazer uma reserva!', 'Fechar');
      this._router.navigate(['/login']);
      return;
    }
    const dialogRef = this._matDialog.open(CreateBookingDialogComponent, {
      width: '750px',
      data: this.sendDialogData()
    });

    dialogRef.afterClosed().subscribe(result => {
      const data: ICreateBooking = this.createBookingData(result);
      this._bookingService.createSelfBooking(data).subscribe({
        next: () => {
          this._snackBarService.showSnackBar('Reserva criada com sucesso!', 'Fechar');
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      })
    })
  }

  private sendDialogData() {
    const data = {
        checkIn: this.checkIn.value,
        checkOut: this.checkOut.value,
        pricePerNight: this.pricePerNight,
        guestsQuantity: this.guestsQuantity.value,
        capacityOptions: this.capacityOptions,
        unavailableDates: this.unavailableDates,
      }
    return data;
  }

  private createBookingData(result: any): ICreateBooking {
    const data: ICreateBooking = {
      roomId: this.roomId,
      checkIn: result.bookingData.checkIn,
      checkOut: result.bookingData.checkOut,
      guestsQuantity: result.bookingData.guestsQuantity,
      payment: {
        paymentType: result.paymentData.paymentType,
        isOnlinePayment: result.paymentData.paymentType === 1 ? false : true,
        installmentQuantity: result.paymentData.installmentQuantity,
        creditCardId: result.paymentData.creditCardId
      } 
    }
    return data;
  }


}
