import { Component, Input } from '@angular/core';
import { IBookingDetailResponse } from '../../interfaces/booking/booking-detail-response.interface';
import { CommonModule } from '@angular/common';
import { PaymentTypePipe } from '../../pipes/payment-type.pipe';
import { RoomTypePipe } from '../../pipes/room-type.pipe';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [
    CommonModule,
    PaymentTypePipe,
    RoomTypePipe
  ],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.scss'
})
export class BookingCardComponent {

  @Input({required: true})
  booking!: IBookingDetailResponse;

  get nights(): number {
    if (!this.booking.checkIn || !this.booking.checkOut) {
      return 0;
    }
    const checkInDate = new Date(this.booking.checkIn);
    const checkOutDate = new Date(this.booking.checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

}
