import { Component, Input } from '@angular/core';
import { IBookingDetailResponse } from '../../interfaces/booking/booking-detail-response.interface';
import { CommonModule } from '@angular/common';
import { PaymentTypePipe } from '../../pipes/payment-type.pipe';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [
    CommonModule,
    PaymentTypePipe
  ],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.scss'
})
export class BookingCardComponent {
//   @Input({required: true})
//   booking!: IBookingDetailResponse;
// 
}
