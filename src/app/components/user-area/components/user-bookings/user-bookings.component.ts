import { Component } from '@angular/core';
import { BookingCardComponent } from '../../../booking-card/booking-card.component';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [
    BookingCardComponent
  ],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss'
})
export class UserBookingsComponent {

}
