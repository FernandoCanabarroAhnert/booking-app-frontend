import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HotelService } from '../../../../services/hotel.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { RoomList } from '../../../../types/room-list.type';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomService } from '../../../../services/room.service';
import { AuthService } from '../../../../services/auth.service';
import { IRoomDetailResponse } from '../../../../interfaces/room/room-detail-response.interface';
import { RoomDialogComponent } from './components/room-dialog/room-dialog.component';
import { RoomTypePipe } from '../../../../pipes/room-type.pipe';
import { IHotelSearchResponse } from '../../../../interfaces/hotel/hotel-search-response.interface';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PaginationComponent,
    RoomTypePipe
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {

  isOnlyOperator: boolean = false;
  isAdmin: boolean = false;
  operatorWorkingHotelId: number = 1;

  rooms$!: Observable<IPageResponse<RoomList>>;
  displayedColumns = ['id', 'type', 'pricePerNight', 'capacity', 'averageRating', 'hotelName', 'actions'];

  hotelsList: IHotelSearchResponse[] = [];

  private readonly _authService = inject(AuthService);
  private readonly _roomService = inject(RoomService);
  private readonly _hotelService = inject(HotelService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _snackBarServce = inject(SnackBarService);

  ngOnInit(): void {
    this.obtainUserAuthority();
    if (this.isOnlyOperator) this.obtainOperatorWorkingHotelId();
    this.findAllRooms();
    this.populateHotelsList();
  }

  onPageChange(page: number) {
    this.findAllRooms(page);
  }

  onPdfExportButtonClick() {
    this._roomService.exportToPdf().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  onPdfExportGroupByHotelButtonClick() {
    this._roomService.exportToPdfGroupByHotel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  onExcelExportButtonClick() {
    this._roomService.exportToExcel().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rooms.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  onCreateButtonClick() {
    this.openDialog('create', undefined, (result) => {
      this._roomService.createRoom(result.data).subscribe({
        next: () => {
          this._snackBarServce.showSnackBar('Quarto criado com sucesso!', 'Fechar');
          this.findAllRooms();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      })
    });
  }

  onViewButtonClick(roomId: number) {
    this._roomService.findById(roomId).subscribe({
      next: (room) => {
        this.openDialog('view', room);
      }
    })
  }

  onEditButtonClick(roomId: number) {
    this._roomService.findById(roomId).subscribe({
      next: (room) => {
        this.openDialog('update', room, (result) => {
          this._roomService.updateRoom(roomId, result.data).subscribe({
            next: () => {
              this._snackBarServce.showSnackBar('Quarto atualizado com sucesso!', 'Fechar');
              this.findAllRooms();
            },
            error: (error: HttpErrorResponse) => {
              console.error(error);
            }
          });
          result.imagesIdsForDelete.forEach((imageId: number) => {
            this._hotelService.deleteImage(imageId).subscribe({});
          })
        });
      }
    });
  }

  onDeleteButtonClick(roomId: number) {
    const dialogRef = this._matDialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: {
        resource: 'Quarto'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this._snackBarServce.showSnackBar('Quarto deletado com sucesso!', 'Fechar');
          this.findAllRooms();
        },
        error: (error: HttpErrorResponse) => {
          const BAD_REQUEST_ERROR = error.status === 400;
          const NOT_FOUND_ERROR = error.status === 404;
          const INTERNAL_SERVER_ERROR = error.status === 500;
          if (BAD_REQUEST_ERROR) {
            this._snackBarServce.showSnackBar('Quarto não pode ser excluído pois há reservas ativas cadastradas nele', 'Fechar');
          }
          if (NOT_FOUND_ERROR) {
            this._snackBarServce.showSnackBar('Quarto não encontrado', 'Fechar');
          }
          if (INTERNAL_SERVER_ERROR) {
            this._snackBarServce.showSnackBar('Um erro inesperado ocorreu. Tente novamente mais tarde.', 'Fechar');
          }
        }
      })
    })
  }

  private openDialog(option: 'view' | 'create' | 'update', room?: IRoomDetailResponse, callback?: (result: any) => void, ) {
    const data = this.buildDialogData(option, room);
    const dialogRef = this._matDialog.open(RoomDialogComponent, {
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (!callback) return;
      callback(result);
    });
  }

  private buildDialogData(option: 'view' | 'create' | 'update', room?: IRoomDetailResponse) {
    switch (option) {
      case 'view':
        return { room, isCreateForm: false, isUpdateForm: false, isView: true };
      case 'create':
        return { isCreateForm: true, isUpdateForm: false, isView: false, hotelsList: this.hotelsList };
      case 'update':
        return { room, isCreateForm: false, isUpdateForm: true, isView: false, hotelsList: this.hotelsList };
    }
  }

  private findAllRooms(page: number = 1) {
    if (this.isOnlyOperator) {
      this.rooms$ = this._hotelService.findAllRoomsByHotelId(this.operatorWorkingHotelId, page, 10);
    }
    if (this.isAdmin) {
      this.rooms$ = this._roomService.findAllRooms(page, 10);
    }
  }

  private obtainUserAuthority() {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
  }

  private obtainOperatorWorkingHotelId() {
    this._authService.getMe().subscribe(response => this.operatorWorkingHotelId = response.workingHotelId);
  }

  private populateHotelsList() {
    this._hotelService.findAllByName('').subscribe(response => this.hotelsList = response);
  }

}
