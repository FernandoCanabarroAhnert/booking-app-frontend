import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IHotelSearchResponse } from '../../../../../../interfaces/hotel/hotel-search-response.interface';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { formatDateToISODate } from '../../../../../../utils/date-utils';

@Component({
  selector: 'app-booking-pdf-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    CommonModule,
    MatCheckboxModule,
    NgxMaskDirective,
    MatAutocompleteModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './booking-pdf-dialog.component.html',
  styleUrl: './booking-pdf-dialog.component.scss'
})
export class BookingPdfDialogComponent implements OnInit {

  bookingPdfForm: FormGroup = {} as FormGroup;
  hotelsList: IHotelSearchResponse[] = [];
  filteredHotelsList!: Observable<IHotelSearchResponse[]>;

  private readonly _data = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<BookingPdfDialogComponent>);
  private readonly _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();
    this.hotelsList = this._data.hotels;
    this.filteredHotelsList = this.hotel.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.hotelsList.slice();
      }),
    );
  }

  get checkIn(): FormControl {
    return this.bookingPdfForm.get('checkIn') as FormControl;
  }
  get checkOut(): FormControl {
    return this.bookingPdfForm.get('checkOut') as FormControl;
  }
  get hotel(): FormControl {
    return this.bookingPdfForm.get('hotel') as FormControl;
  }
  get minAmount(): FormControl {
    return this.bookingPdfForm.get('minAmount') as FormControl;
  }
  get maxAmount(): FormControl {
    return this.bookingPdfForm.get('maxAmount') as FormControl;
  }
  get dinheiro(): FormControl {
    return this.bookingPdfForm.get('dinheiro') as FormControl;
  }
  get cartao(): FormControl {
    return this.bookingPdfForm.get('cartao') as FormControl;
  }
  get pix(): FormControl {
    return this.bookingPdfForm.get('pix') as FormControl;
  }
  get boleto(): FormControl {
    return this.bookingPdfForm.get('boleto') as FormControl;
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
    this._dialogRef.close(this.getFormValue());
  }

  private createForm() {
    this.bookingPdfForm = this._fb.group({
      checkIn: [null],
      checkOut: [null],
      hotel: new FormControl<IHotelSearchResponse | string>(''),
      minAmount: [null],
      maxAmount: [null],
      dinheiro: [''],
      cartao: [''],
      pix: [''],
      boleto: [''],
    })
  }

  private getFormValue() {
    return {
      checkIn: this.checkIn.value ? formatDateToISODate(this.checkIn.value as Date) : '',
      checkOut: this.checkOut.value ? formatDateToISODate(this.checkOut.value as Date) : '',
      hotelId: this.hotel.value.id,
      minAmount: this.minAmount.value ? this.minAmount.value : '',
      maxAmount: this.maxAmount.value ? this.maxAmount.value : '',
      dinheiro: this.dinheiro.value ? 'DINHEIRO' : '',
      cartao: this.cartao.value ? 'CARTAO' : '',
      pix: this.pix.value ? 'PIX' : '',
      boleto: this.boleto.value ? 'BOLETO' : ''
    }
  }

  private _filter(name: string): IHotelSearchResponse[] {
    const filterValue = name.toLowerCase();
    return this.hotelsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }


}
