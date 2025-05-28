import { Component, inject, Input, OnInit } from '@angular/core';
import { IRoomFilterResponse } from '../../../../../../interfaces/room/room-filter-response.interface';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../../../interfaces/page/page-response.interface';
import { RoomList } from '../../../../../../types/room-list.type';
import { RoomFilterComponent } from '../../../../../room-filter/room-filter.component';
import { RoomCardComponent } from '../../../../../room-card/room-card.component';
import { PaginationComponent } from '../../../../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../../../../services/room.service';
import { AuthService } from '../../../../../../services/auth.service';
import { HotelService } from '../../../../../../services/hotel.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { BookingService } from '../../../../../../services/booking.service';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { UserService } from '../../../../../../services/user.service';
import { IUserSearchResponse } from '../../../../../../interfaces/user/user-search-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { IAdminCreateBookingRequest } from '../../../../../../interfaces/booking/admin-create-booking-request.interface';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [
    RoomFilterComponent,
    RoomCardComponent,
    PaginationComponent,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.scss'
})
export class CreateBookingComponent implements OnInit {

  isOnlyOperator: boolean = true;
  operatorWorkingHotelId!: number;

  roomFilter!: IRoomFilterResponse;
  rooms$!: Observable<IPageResponse<RoomList>>; 

  @Input({ required: true })
  usersList: IUserSearchResponse[] = [];

  private readonly _roomService = inject(RoomService);
  private readonly _authService = inject(AuthService);
  private readonly _hotelService = inject(HotelService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _bookingService = inject(BookingService);
  private readonly _pageSize: number = 8;

  ngOnInit(): void {
    this.isOnlyOperator = AuthService.isOnlyOperator();
    if (this.isOnlyOperator) {
      this._authService.getMe().subscribe(response => {
        this.operatorWorkingHotelId = response.workingHotelId;
        this.rooms$ = this._hotelService.findAllRoomsByHotelId(response.workingHotelId, 1, this._pageSize);
      })
    }
    else {
      this.rooms$ = this._roomService.findAllRooms(1, this._pageSize);
    }
  }

  showCreateDialog(roomId: number) {
    this._roomService.findById(roomId).subscribe(room => {
      const dialogRef = this._matDialog.open(BookingDialogComponent, {
        width: '800px',
        data: {
          isCreateForm: true, 
          isUpdateForm: false, 
          isView: false,
          roomId,
          checkIn: this.roomFilter ? new Date(new Date(this.roomFilter.checkIn).setHours(24, 0, 0, 0)) : new Date(Date.now()),
          checkOut: this.roomFilter ? new Date(new Date(this.roomFilter.checkOut).setHours(24, 0, 0, 0)) : new Date(Date.now() + 86400000),
          usersList: this.usersList,
          room: room
        }
      });
      dialogRef.afterClosed().subscribe((result: IAdminCreateBookingRequest) => {
        if (result) {
          this._bookingService.adminCreateBooking(result).subscribe({
            next: () => {
              this._snackBarService.showSnackBar('Reserva criada com sucesso!', 'Fechar');
              this.queryRooms(1);
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          })
        }
      })
    })
  }

  onFilterSubmit(filter: IRoomFilterResponse) {
    this.roomFilter = filter;
    this.queryRooms(1);
  }

  queryRooms(page: number) {
    if (this.roomFilter) {
      if (this.isOnlyOperator) {
        this.rooms$ = this._roomService.findAllRoomsWithFilter(page, this._pageSize, this.roomFilter.checkIn, this.roomFilter.checkOut, 
          '', this.roomFilter.capacity, this.roomFilter.types, this.operatorWorkingHotelId);
      }
      else {
        this.rooms$ = this._roomService.findAllRoomsWithFilter(page, this._pageSize, this.roomFilter.checkIn, this.roomFilter.checkOut, 
          this.roomFilter.city, this.roomFilter.capacity, this.roomFilter.types);
      }
    }
    else {
      if (this.isOnlyOperator) this.rooms$ = this._hotelService.findAllRoomsByHotelId(this.operatorWorkingHotelId, page, this._pageSize);
      else this.rooms$ = this._roomService.findAllRooms(page, this._pageSize);
    }
  }

}
