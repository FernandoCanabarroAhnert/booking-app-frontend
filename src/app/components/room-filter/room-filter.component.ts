import { Component, EventEmitter, Output } from '@angular/core';
import { IRoomFilterResponse } from '../../interfaces/room/room-filter-response.interface';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { RoomTypePipe } from '../../pipes/room-type.pipe';

@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    RoomTypePipe
  ],
  templateUrl: './room-filter.component.html',
  styleUrl: './room-filter.component.scss',
  providers: [
    provideNativeDateAdapter()
  ]
})
export class RoomFilterComponent {

  @Output()
  onFilterSubmitEmitter = new EventEmitter<IRoomFilterResponse>();

  roomFilterForm = new FormGroup({
    city: new FormControl<string | null>(''),
    checkIn: new FormControl<Date | null>(new Date(Date.now()), { validators: [Validators.required] }),
    checkOut: new FormControl<Date | null>(new Date(Date.now() + 24 * 60 * 60 * 1000), { validators: [Validators.required] }),
    capacity: new FormControl<number | null>(1, { validators: [Validators.required] }),
    types: new FormControl<string[]>(['SINGLE', 'DOUBLE', 'SUITE'])
  });

  roomTypes = [
    { value: 'SINGLE', enum: 1 },
    { value: 'DOUBLE', enum: 2 },
    { value: 'SUITE', enum: 3 }
  ]

  get city(): FormControl {
    return this.roomFilterForm.get('city') as FormControl;
  }
  get checkIn(): FormControl {
    return this.roomFilterForm.get('checkIn') as FormControl;
  }
  get checkOut(): FormControl {
    return this.roomFilterForm.get('checkOut') as FormControl;
  }
  get capacity(): FormControl {
    return this.roomFilterForm.get('capacity') as FormControl;
  }
  get types(): FormControl {
    return this.roomFilterForm.get('types') as FormControl;
  }

  onSubmit() {
    this.onFilterSubmitEmitter.emit({
      city: this.city.value,
      checkIn: this.formatDateToISODate(this.checkIn.value as Date),
      checkOut: this.formatDateToISODate(this.checkOut.value as Date),
      capacity: this.capacity.value,
      types: this.types.value
    })
  }

  private formatDateToISODate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

}
