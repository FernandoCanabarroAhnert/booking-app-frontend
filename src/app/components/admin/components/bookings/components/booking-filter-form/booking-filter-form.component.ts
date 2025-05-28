import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IHotelSearchResponse } from '../../../../../../interfaces/hotel/hotel-search-response.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formatDateToISODate } from '../../../../../../utils/date-utils';
import { map, Observable, startWith } from 'rxjs';
import { IBookingFormFilterResponse } from '../../../../../../interfaces/booking/booking-form-filter-response.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { PaymentTypePipe } from '../../../../../../pipes/payment-type.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'app-booking-filter-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    PaymentTypePipe,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './booking-filter-form.component.html',
  styleUrl: './booking-filter-form.component.scss'
})
export class BookingFilterFormComponent implements OnInit {

  @Input({ required: true })
  isOnlyOperator: boolean = false;
  operatorWorkingHotelId!: number;

  @Input({ required: true })
  hotelsList: IHotelSearchResponse[] = [];
  filteredHotelsList!: Observable<IHotelSearchResponse[]>;

  @Output()
  onBookingFilterEmit = new EventEmitter<IBookingFormFilterResponse>();

  bookingFilterForm: FormGroup = {} as FormGroup;

  paymentTypes = [
    { value: 'DINHEIRO', enum: 1 },
    { value: 'CARTAO', enum: 2 },
    { value: 'PIX', enum: 3 },
    { value: 'BOLETO', enum: 4 }
  ]
  
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this.createForm();
    if (this.isOnlyOperator) {
      this._authService.getMe().subscribe(response => this.operatorWorkingHotelId = response.workingHotelId);
    }
    this.filteredHotelsList = this.hotel.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.hotelsList.slice();
      }),
    );
  }

  get checkIn(): FormControl {
    return this.bookingFilterForm.get('checkIn') as FormControl;
  }
  get checkOut(): FormControl {
    return this.bookingFilterForm.get('checkOut') as FormControl;
  }
  get hotel(): FormControl {
    return this.bookingFilterForm.get('hotel') as FormControl;
  }
  get minAmount(): FormControl {
    return this.bookingFilterForm.get('minAmount') as FormControl;
  }
  get maxAmount(): FormControl {
    return this.bookingFilterForm.get('maxAmount') as FormControl;
  }
  get paymentType(): FormControl {
    return this.bookingFilterForm.get('paymentType') as FormControl;
  }

  displayFn(hotel: IHotelSearchResponse): string {
    return hotel && hotel.name ? hotel.name : '';
  }

  onSubmit() {
    if (this.maxAmount.value && this.minAmount.value) {
      if (this.maxAmount.value < this.minAmount.value) {
        this.maxAmount.setErrors({ min: true });
        return;
      }
    }
    this.onBookingFilterEmit.emit(this.getFormValue());
  }

  private createForm() {
    this.bookingFilterForm = this._fb.group({
      checkIn: [null],
      checkOut: [null],
      hotel: new FormControl<IHotelSearchResponse | string>(''),
      minAmount: [null],
      maxAmount: [null],
      paymentType: [['DINHEIRO', 'CARTAO', 'PIX', 'BOLETO']]
    })
  }

  private getFormValue() {
    return {
      checkIn: this.checkIn.value ? formatDateToISODate(this.checkIn.value as Date) : '',
      checkOut: this.checkOut.value ? formatDateToISODate(this.checkOut.value as Date) : '',
      hotelId: this.isOnlyOperator ? this.operatorWorkingHotelId : this.hotel.value.id,
      minPrice: this.minAmount.value ? this.minAmount.value : '',
      maxPrice: this.maxAmount.value ? this.maxAmount.value : '',
      paymentType: this.paymentType.value
    }
  }

  private _filter(name: string): IHotelSearchResponse[] {
    const filterValue = name.toLowerCase();
    return this.hotelsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
