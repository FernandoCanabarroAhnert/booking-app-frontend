import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PaginationComponent } from '../../../../../pagination/pagination.component';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../../../interfaces/page/page-response.interface';
import { BookingList } from '../../../../../../types/booking-list.type';
import { BookingService } from '../../../../../../services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { IBookingDetailResponse } from '../../../../../../interfaces/booking/booking-detail-response.interface';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { IRoomDetailResponse } from '../../../../../../interfaces/room/room-detail-response.interface';
import { RoomService } from '../../../../../../services/room.service';
import { IUserSearchResponse } from '../../../../../../interfaces/user/user-search-response.interface';
import { AuthService } from '../../../../../../services/auth.service';
import { PaymentTypePipe } from '../../../../../../pipes/payment-type.pipe';
import { BookingPdfDialogComponent } from '../booking-pdf-dialog/booking-pdf-dialog.component';
import { IBookingPdfFilterResponse } from '../../../../../../interfaces/booking/booking-pdf-filter-response.interface';
import { IHotelSearchResponse } from '../../../../../../interfaces/hotel/hotel-search-response.interface';
import { IAdminUpdateBookingRequest } from '../../../../../../interfaces/booking/admin-update-booking-request.interface';
import { BookingFilterFormComponent } from '../booking-filter-form/booking-filter-form.component';
import { IBookingFormFilterResponse } from '../../../../../../interfaces/booking/booking-form-filter-response.interface';
import { DeleteConfirmationDialogComponent } from '../../../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    CommonModule,
    MatTableModule,
    PaginationComponent,
    PaymentTypePipe,
    BookingFilterFormComponent
  ],
  templateUrl: './booking-management.component.html',
  styleUrl: './booking-management.component.scss'
})
export class BookingManagementComponent implements OnInit {

  @Input({ required: true })
  usersList: IUserSearchResponse [] = [];
  @Input({ required: true })
  hotelsList: IHotelSearchResponse[] = [];

  filter!: IBookingFormFilterResponse;

  bookings$!: Observable<IPageResponse<BookingList>>;
  isAdmin: boolean = false;
  isOnlyOperator: boolean = false;
  operatorWorkingHotelId!: number;
  displayedColumns = ['id', 'checkIn', 'checkOut', 'totalPrice', 'paymentType', 'userFullName', 'userCpf', 'hotelName', 'actions'];

  sort: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  private readonly _bookingService = inject(BookingService);
  private readonly _roomService = inject(RoomService);
  private readonly _authService = inject(AuthService);
  private readonly _snackBarServce = inject(SnackBarService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _pageSize = 10;

  ngOnInit(): void {
    this.obtainUserAuthority();
    if (this.isOnlyOperator) {
      this._authService.getMe().subscribe(response => {
        this.operatorWorkingHotelId = response.workingHotelId;
        this.bookings$ = this._bookingService.findAllBookings(1, this._pageSize, 'id,asc', '', '', response.workingHotelId);
      });
    }
    else {
      this.bookings$ = this._bookingService.findAllBookings();
    }
  }

  onBookingFilterEmit(filter: IBookingFormFilterResponse) {
    this.filter = filter;
    this.findAllBookings(1);
  }

  findAllBookings(page: number): void {
    if (this.filter) {
      if (this.isOnlyOperator) {
        this.bookings$ = this._bookingService.findAllBookings(page, this._pageSize, `${this.sort},${this.sortDirection}`, this.filter.checkIn, this.filter.checkOut, this.operatorWorkingHotelId, 
          this.filter.minPrice, this.filter.maxPrice, this.filter.paymentType);
      }
      else {
        this.bookings$ = this._bookingService.findAllBookings(page, this._pageSize, `${this.sort},${this.sortDirection}`, this.filter.checkIn, this.filter.checkOut, this.filter.hotelId, 
          this.filter.minPrice, this.filter.maxPrice, this.filter.paymentType);
      }
    }
    else {
      if (this.isOnlyOperator) {
        this.bookings$ = this._bookingService.findAllBookings(page, this._pageSize, `${this.sort},${this.sortDirection}`, '', '', this.operatorWorkingHotelId);
      }
      else {
        this.bookings$ = this._bookingService.findAllBookings(page, this._pageSize, `${this.sort},${this.sortDirection}`);
      }
    }
  }

  onPdfExportButtonClick() {
    const dialogRef = this._matDialog.open(BookingPdfDialogComponent, {
      width: '600px',
      data: {
        hotels: this.hotelsList
      }
    });
    dialogRef.afterClosed().subscribe((result: IBookingPdfFilterResponse) => {
      if (!result) return;
      this._bookingService.exportToPdf(result.checkIn, result.checkOut, result.minAmount, result.maxAmount,
        result.dinheiro, result.cartao, result.pix, result.boleto, result.hotelId
      )
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      })
    })
    
  }

  onExcelExportButtonClick() {
    this._bookingService.exportToExcel().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  onViewButtonClick(bookingId: number) {
    this._bookingService.findById(bookingId).subscribe({
      next: (booking) => {
        this._roomService.findById(booking.room.id).subscribe({
          next: (room) => {
            this.openDialog('view', booking, room);
          }
        })
      }
    })
  }

  onEditButtonClick(bookingId: number) {
    this._bookingService.findById(bookingId).subscribe({
      next: (booking) => {
        this._roomService.findById(booking.room.id).subscribe({
          next: (room) => {
            this.openDialog('update', booking, room, (result: IAdminUpdateBookingRequest) => {
              if (result) {
                console.log(result);
                this._bookingService.adminUpdateBooking(booking.id, result).subscribe({
                  next: () => {
                    this._snackBarServce.showSnackBar('Reserva atualizada com sucesso!', 'Fechar');
                    this.bookings$ = this._bookingService.findAllBookings();
                  },
                  error: (error) => {
                    console.log(error);
                  }
                })
              }
            })
          }
        })
      }
    });
  }

  onDeleteButtonClick(bookingId: number) {
    const dialogRef = this._matDialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: {
        resource: 'Reserva'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.bookings$ = this._bookingService.findAllBookings();
          this._snackBarServce.showSnackBar('Reserva excluída com sucesso!', 'Fechar');
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
    })
  }

  private openDialog(option: 'view' | 'update', booking: IBookingDetailResponse, room: IRoomDetailResponse, callback?: (result: any) => void, ) {
    const data = this.buildDialogData(option, booking, room);
    const dialogRef = this._matDialog.open(BookingDialogComponent, {
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (!callback) return;
      callback(result);
    });
  }

  private buildDialogData(option: 'view' | 'update', booking: IBookingDetailResponse, room: IRoomDetailResponse) {
    switch (option) {
      case 'view':
        return { booking, room, isCreateForm: false, isUpdateForm: false, isView: true, isGuestView: false };
      case 'update':
        return { booking, room, isCreateForm: false, isUpdateForm: true, isView: false, usersList: this.usersList };
    }
  }

  private obtainUserAuthority() {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
  }

}
