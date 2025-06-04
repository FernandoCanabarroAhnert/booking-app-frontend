import { Component, inject, OnInit } from '@angular/core';
import { RoomService } from '../../../../services/room.service';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { RoomRatingList } from '../../../../types/room-rating-list.type';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { RoomRatingComponent } from '../../../room-details/components/room-details-ratings/components/room-rating/room-rating.component';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { RoomRatingDialogComponent } from '../room-rating-dialog/room-rating-dialog.component';

@Component({
  selector: 'app-user-ratings',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    RoomRatingComponent
  ],
  templateUrl: './user-ratings.component.html',
  styleUrl: './user-ratings.component.scss'
})
export class UserRatingsComponent implements OnInit {

  roomRatings$!: Observable<IPageResponse<RoomRatingList>>;

  private readonly _roomService = inject(RoomService);
  private readonly _snackBarService = inject(SnackBarService);
  private readonly _matDialog = inject(MatDialog);

  ngOnInit(): void {
    this.findMyRatings();
  }

  findMyRatings(page: number = 1): void {
    this.roomRatings$ = this._roomService.findMyRatings(page);
  }

  onUpdateClick(roomRatingId: number): void {
    this._roomService.findRatingById(roomRatingId).subscribe({
      next: (roomRating) => {
        const dialogRef = this._matDialog.open(RoomRatingDialogComponent, {
          width: '600px',
          data: {
            isCreate: false,
            isUpdate: true,
            roomRating
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) return;
          this._roomService.updateRating(roomRatingId, result).subscribe({
            next: () => {
              this.findMyRatings();
              this._snackBarService.showSnackBar('Avaliação atualizada com sucesso!', 'Fechar');
            },
            error: (error: HttpErrorResponse) => {
              const NOT_FOUND_ERROR = error.status === 404;
              if (NOT_FOUND_ERROR) {
                this._snackBarService.showSnackBar('Avaliação não encontrada!', 'Fechar');
              }
              else {
                this._snackBarService.showSnackBar('Um erro inesperado ocorreu. Tente novamente mais tarde', 'Fechar');
              }
            }
          });
        })
      },
      error: (error: HttpErrorResponse) => {
        const NOT_FOUND_ERROR = error.status === 404;
        if (NOT_FOUND_ERROR) {
          this._snackBarService.showSnackBar('Avaliação não encontrada!', 'Fechar');
        }
        else {
          this._snackBarService.showSnackBar('Um erro inesperado ocorreu. Tente novamente mais tarde', 'Fechar');
        }
      }
    })
  }

  onDeleteClick(roomRatingId: number): void {
    const dialogRef = this._matDialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: {
        resource: 'Avaliação'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._roomService.deleteRating(roomRatingId).subscribe({
        next: () => {
          this.findMyRatings();
          this._snackBarService.showSnackBar('Avaliação deletada com sucesso!', 'Fechar');
        },
        error: (error: HttpErrorResponse) => {
          const NOT_FOUND_ERROR = error.status === 404;
          if (NOT_FOUND_ERROR) {
            this._snackBarService.showSnackBar('Avaliação não encontrada!', 'Fechar');
          }
          else {
            this._snackBarService.showSnackBar('Um erro inesperado ocorreu. Tente novamente mais tarde', 'Fechar');
          }
        }
      });
    });
  }

}
