import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
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
  pricePerNight!: number;
  @Input({ required: true })
  set capacity(value: number) {
    this._capacity = value;
    this.capacityOptions = Array.from({ length: this._capacity }, (_, i) => i + 1);
  }
  @Input({ required: true })
  unavailableDates!: Date[];

  today = new Date(new Date().setHours(0, 0, 0, 0));
  milisecondsInDay = 86400000;
  checkOutMinDate = new Date(this.today.getTime() + this.milisecondsInDay);

  range = new FormGroup({
    start: new FormControl<Date | null>(this.today),
    end: new FormControl<Date | null>(new Date(this.today.getTime() + this.milisecondsInDay)),
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
    const diff = this.range.value.end!.getTime() - this.range.value.start!.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get totalPrice(): number {
    return this.nights * this.pricePerNight;
  }

  get checkIn(): FormControl {
    return this.range.get('start') as FormControl;
  }

  get checkOut(): FormControl {
    return this.range.get('end') as FormControl;
  }

  onCheckInChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.range.value.start!.getTime() + this.milisecondsInDay);
    if (event.value && this.range.value.end) {
      if (event.value.getTime() > this.range.value.end.getTime()) {
        this.range.patchValue({ end: new Date(event.value.getTime() + this.milisecondsInDay)});
      }
    }
  }

  onCheckOutChange(event: MatDatepickerInputEvent<Date>) {
    this.checkOutMinDate = new Date(this.range.value.start!.getTime() + this.milisecondsInDay);
    if (event.value && this.range.value.start) {
      if (event.value.getTime() < this.range.value.start.getTime()) {
        this.range.setValue({ end: this.range.value.start, start: event.value });
      }
    }
  }

  console() {
    console.log(this.range.get('start'));
  }

}
