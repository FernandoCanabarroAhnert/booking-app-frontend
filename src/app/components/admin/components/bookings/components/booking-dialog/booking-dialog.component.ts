import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IBookingDetailResponse } from '../../../../../../interfaces/booking/booking-detail-response.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentTypePipe } from '../../../../../../pipes/payment-type.pipe';
import { paymentTypeEnumMap } from '../../../../../../utils/payment-type-enum-map';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { IUserSearchResponse } from '../../../../../../interfaces/user/user-search-response.interface';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IRoomDetailResponse } from '../../../../../../interfaces/room/room-detail-response.interface';
import { RoomTypePipe } from '../../../../../../pipes/room-type.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { formatDateToISODate } from '../../../../../../utils/date-utils';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    PaymentTypePipe,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    RoomTypePipe,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrl: './booking-dialog.component.scss'
})
export class BookingDialogComponent {

  roomId!: number;
  dialogTitle: string = 'Visualizar Reserva';
  buttonAction: string = 'Salvar';
  isCreateForm: boolean = false;
  isUpdateForm: boolean = false;
  isView: boolean = false;
  bookingData!: IBookingDetailResponse;
  bookingForm: FormGroup = {} as FormGroup;
  roomData!: IRoomDetailResponse;
  pricePerNight!: number;
  capacity!: number;
  capacityOptions!: number[];
  isGuestView: boolean = false;

  usersList: IUserSearchResponse[] = [];
  filteredUsersList!: Observable<IUserSearchResponse[]>;

  today = new Date(new Date().setHours(0, 0, 0, 0));
  milisecondsInDay = 86400000;
  checkOutMinDate = new Date(this.today.getTime() + this.milisecondsInDay);
  paymentKeys = Object.keys(paymentTypeEnumMap).map(Number);
  installments!: Map<number, number>;

  dateFilter!: (d: Date | null) => boolean;

  private readonly _dialogRef = inject(MatDialogRef<BookingDialogComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.setDialogData();
    if (this.isCreateForm || this.isUpdateForm) {
      this.filteredUsersList = this.user.valueChanges.pipe(
        startWith(''),
        map(value => {
          const cpf = typeof value === 'string' ? value : value?.name;
          return cpf ? this._filter(cpf as string) : this.usersList.slice();
        }),
      );
      this.setupInstallments();
    }
  }

  get nights(): number {
    const diff = this.bookingForm.value.checkOut!.getTime() - this.bookingForm.value.checkIn!.getTime();
    return Math.ceil(diff / this.milisecondsInDay);
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
  get user(): FormControl {
    return this.bookingForm.get('user') as FormControl;
  }
  get guestsQuantity(): FormControl {
    return this.bookingForm.get('guestsQuantity') as FormControl;
  }
  get paymentType(): FormControl {
    return this.bookingForm.get('paymentType') as FormControl;
  }
  get installmentQuantity(): FormControl {
    return this.bookingForm.get('installmentQuantity') as FormControl;
  }
  get isFinished(): FormControl {
    return this.bookingForm.get('isFinished') as FormControl;
  }

  displayFn(user: IUserSearchResponse): string {
    return user && user.cpf ? user.cpf : '';
  }

  formatUserCpf(event: Event) {
    const input = event.target as HTMLInputElement;
    let cpf = input.value;
    if (cpf) {
      if (cpf.length >= 4 && cpf.length <= 7) {
        input.value = cpf.replace(/(\d{3})(\d{1,2})/, '$1.$2');
      }
      if (cpf.length > 7 && cpf.length <= 11) {
        cpf = cpf.replace(/\D/g, '');
        input.value = cpf.replace(/(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3');
      }
      if (cpf.length > 10) {
        cpf = cpf.replace(/\D/g, '');
        input.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      }
    }
  }

  onCheckInChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.bookingForm.value.checkIn!.getTime() + this.milisecondsInDay);
    if (event.value && this.bookingForm.value.checkOut) {
      if (event.value.getTime() >= this.bookingForm.value.checkOut.getTime()) {
        this.bookingForm.patchValue({ checkOut: new Date(event.value.getTime() + this.milisecondsInDay)});
      }
    }
    this.setupInstallments();
  }
  
  onCheckOutChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.bookingForm.value.checkIn!.getTime() + this.milisecondsInDay);
    if (event.value && this.bookingForm.value.checkIn) {
      if (event.value.getTime() < this.bookingForm.value.checkIn.getTime()) {
        this.bookingForm.patchValue({ checkOut: this.bookingForm.value.checkIn, checkIn: event.value });
      }
    }
    this.setupInstallments();
  }

  onCloseDialog() {
    if (this.bookingForm.invalid && (!this.isUpdateForm)) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    if (this.bookingForm.invalid && this.isUpdateForm && (this.hasCheckInValueChanged() || this.hasCheckOutValueChanged())) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    this._dialogRef.close(this.getBookingFormValue());
  }

  hasCheckInValueChanged(): boolean {
    return this.checkIn.dirty && this.checkIn.value !== new Date(new Date(this.bookingData.checkIn).setHours(24, 0, 0, 0));
  }
  hasCheckOutValueChanged(): boolean {
    return this.checkOut.dirty && this.checkOut.value !== new Date(new Date(this.bookingData.checkOut).setHours(24, 0, 0, 0));
  }

  private getBookingFormValue() {
    if (this.isCreateForm) {
      return {
        roomId: this.roomId,
        userId: this.user.value.id,
        checkIn: this.checkIn.value,
        checkOut: this.checkOut.value,
        guestsQuantity: this.guestsQuantity.value,
        payment: {
          paymentType: this.paymentType.value,
          isOnlinePayment: false,
          installmentQuantity: this.installmentQuantity.value,
          creditCardId: null
        }
      }
    }
    else {
      console.log(this.bookingForm.value);
      return {
        userId: this.user.value.id,
        checkIn: formatDateToISODate(this.checkIn.value),
        checkOut: formatDateToISODate(this.checkOut.value),
        guestsQuantity: this.guestsQuantity.value,
        roomId: this.roomId,
        isFinished: this.isFinished.value,
      }
    } 
  }

  private createFormForCreateBooking() {
    this.bookingForm = new FormGroup({
      checkIn: new FormControl<Date | null>(this._data.checkIn),
      checkOut: new FormControl<Date | null>(this._data.checkOut),
      user: new FormControl<IUserSearchResponse | string>('', [Validators.required]),
      guestsQuantity: new FormControl(1, [Validators.required]),
      paymentType: new FormControl(null, [Validators.required]),
      installmentQuantity: new FormControl(1, [Validators.required])
    });
  }

  private createFormForUpdateBooking(checkIn: Date, checkOut: Date, guestsQuantity: number, user: IUserSearchResponse | string) {
    this.bookingForm = new FormGroup({
      checkIn: new FormControl<Date | null>(checkIn),
      checkOut: new FormControl<Date | null>(checkOut),
      user: new FormControl<IUserSearchResponse | string>(user, [Validators.required]),
      guestsQuantity: new FormControl(guestsQuantity, [Validators.required]),
      isFinished: new FormControl(this.bookingData.finished),
    });
    this.checkIn.setErrors(null);
    this.checkOut.setErrors(null);
  }

  private setDialogData() {
    if (this._data.isCreateForm || this._data.isUpdateForm) {
      this.usersList = this._data.usersList;
      this.roomData = this._data.room;
      this.pricePerNight = this.roomData.pricePerNight;
      this.capacity = this.roomData.capacity;
      this.capacityOptions = Array.from({ length: this.capacity }, (_, i) => i + 1);

      this.dateFilter = (d: Date | null): boolean => {
        const day = d || new Date();
        return this.roomData.unavailableDates && !this.roomData.unavailableDates.some((dateStr) => {
          const date = new Date(new Date(dateStr).getTime() + this.milisecondsInDay);
          return (
            date.getDate() === day.getDate() &&
            date.getMonth() === day.getMonth() &&
            date.getFullYear() === day.getFullYear()
          );
        });
      };
    }
    if (this._data.isCreateForm) {
      this.checkOutMinDate = new Date(this._data.checkIn.getTime() + this.milisecondsInDay);
      this.roomId = this._data.roomId;
      this.dialogTitle = 'Cadastrar Reserva';
      this.buttonAction = 'Cadastrar';
      this.isCreateForm = true;
      this.createFormForCreateBooking();
    }
    if (this._data.isUpdateForm) {
      this.roomId = this._data.room.id;
      this.dialogTitle = 'Atualizar Reserva';
      this.buttonAction = 'Atualizar';
      this.isUpdateForm = true;
      this.bookingData = this._data.booking;
      this.createFormForUpdateBooking(new Date(new Date(this.bookingData.checkIn).setHours(24, 0, 0, 0)), 
        new Date(new Date(this.bookingData.checkOut).setHours(24, 0, 0, 0)), this.bookingData.guestsQuantity, this.bookingData.user);
    }
    if (this._data.isView) {
      this.dialogTitle = 'Visualizar Reserva';
      this.isView = true;
      this.bookingData = this._data.booking;
      this.roomData = this._data.room;
      this.isGuestView = this._data.isGuestView;
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

  private _filter(cpf: string): IUserSearchResponse[] {
    const filterValue = cpf.toLowerCase();
    return this.usersList.filter(option => option.cpf.toLowerCase().includes(filterValue));
  }

}
