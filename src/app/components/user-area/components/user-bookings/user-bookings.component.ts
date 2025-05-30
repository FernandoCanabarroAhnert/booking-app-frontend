import { Component, inject, OnInit } from '@angular/core';
import { BookingCardComponent } from '../../../booking-card/booking-card.component';
import { BookingService } from '../../../../services/booking.service';
import { Observable } from 'rxjs';
import { IBookingDetailResponse } from '../../../../interfaces/booking/booking-detail-response.interface';
import { BookingList } from '../../../../types/booking-list.type';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../../../admin/components/bookings/components/booking-dialog/booking-dialog.component';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [
    BookingCardComponent,
    PaginationComponent,
    CommonModule
  ],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss'
})
export class UserBookingsComponent implements OnInit {

  bookings$!: Observable<IPageResponse<IBookingDetailResponse[]>>;

  private readonly _bookingService = inject(BookingService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _roomService = inject(RoomService)

  ngOnInit(): void {
    this.findBookings(1);
  }

  findBookings(page: number) {
    this.bookings$ = this._bookingService.findConnectedUserBookings(page, 9);
  }

  onBookingInfosClick(bookingId: number) {
    this._bookingService.findById(bookingId).subscribe(booking => {
      this._roomService.findById(booking.room.id).subscribe(room => {
        this._matDialog.open(BookingDialogComponent, {
          data: {
            isView: true,
            booking,
            room,
            isGuestView: true
          },
          width: '800px'
        });
      });
    });
  }

}
