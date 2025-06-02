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
import { RoomRatingDialogComponent } from '../room-rating-dialog/room-rating-dialog.component';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  private readonly _roomService = inject(RoomService);
  private readonly _snackBarService = inject(SnackBarService);

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

  onRoomRatingClick(roomId: number) {
    const dialogRef = this._matDialog.open(RoomRatingDialogComponent, {
      width: '600px',
      data: {
        isCreate: true,
        isUpdate: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._roomService.addRating(roomId, result).subscribe({
        next: () => {
          this._snackBarService.showSnackBar('Avaliação adicionada com sucesso!', 'Fechar');
        },
        error: (error: HttpErrorResponse) => {
          const FORBIDDEN_ERROR = error.status === 403;
          const NOT_FOUND_ERROR = error.status === 404;
          const INTERNAL_SERVER_ERROR = error.status === 500;
          if (FORBIDDEN_ERROR) {
            this._snackBarService.showSnackBar('Você só pode avaliar um quarto a mesma quantidade de vezes que você se hospedou nele', 'Fechar');
          }
          if (NOT_FOUND_ERROR) {
            this._snackBarService.showSnackBar('Quarto não encontrado', 'Fechar');
          }
          if (INTERNAL_SERVER_ERROR) {
            this._snackBarService.showSnackBar('Ocorreu um erro inesperado. Tente novamente mais tarde', 'Fechar');
          }
        }
      });
    })
  }

}
