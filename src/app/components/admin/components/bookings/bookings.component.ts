import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { CreateBookingComponent } from './components/create-booking/create-booking.component';
import { UserService } from '../../../../services/user.service';
import { IUserSearchResponse } from '../../../../interfaces/user/user-search-response.interface';
import { BookingManagementComponent } from './components/booking-management/booking-management.component';
import { IHotelSearchResponse } from '../../../../interfaces/hotel/hotel-search-response.interface';
import { HotelService } from '../../../../services/hotel.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    CreateBookingComponent,
    BookingManagementComponent
  ],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {

  usersList: IUserSearchResponse[] = [];
  hotelsList: IHotelSearchResponse[] = [];

  private readonly _userService = inject(UserService);
  private readonly _hotelService = inject(HotelService);

  ngOnInit(): void {
    this._userService.findAllByCpf('').subscribe(response => this.usersList = response);
    if (AuthService.isAdmin()) {
      this._hotelService.findAllByName('').subscribe(response => this.hotelsList = response);
    }
  }

}
