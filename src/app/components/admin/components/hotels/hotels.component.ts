import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HotelService } from '../../../../services/hotel.service';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { HotelList } from '../../../../types/hotel-list.type';
import { IHotelResponse } from '../../../../interfaces/hotel/hotel-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { HotelDialogComponent } from './components/hotel-dialog/hotel-dialog.component';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getHotelFullAddress } from '../../../../utils/hotel-utils';
import { IHotelDetailResponse } from '../../../../interfaces/hotel/hotel-detail-response.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PaginationComponent,
    ReactiveFormsModule
  ],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss',
})
export class HotelsComponent implements OnInit {

  searchForm: FormGroup = {} as FormGroup;
  hotels$!: Observable<IPageResponse<HotelList>>;
  displayedColumns = ['id', 'name', 'description', 'roomQuantity', 'fullAddress', 'actions'];

  private readonly _hotelService = inject(HotelService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _snackBarServce = inject(SnackBarService);
  private readonly _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.findAllHotels();
    this.createHotelQueryForm();
  }

  get query(): FormControl {
    return this.searchForm.get('query') as FormControl;
  }

  onSearchSubmit() {
    this.findAllHotels(1, 10, this.query.value);
  }

  onPageChange(page: number) {
    this.findAllHotels(page);
  }

  hotelFullAddress(hotel: IHotelResponse): string {
    return getHotelFullAddress(hotel);
  }

  onPdfExportButtonClick() {
    this._hotelService.exportToPdf().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  onExcelExportButtonClick() {
    this._hotelService.exportToExcel().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hotels.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  onCreateButtonClick() {
    this.openDialog('create', undefined, (result) => {
      this._hotelService.createHotel(result.data).subscribe({
        next: () => {
          this._snackBarServce.showSnackBar('Hotel criado com sucesso!', 'Fechar');
          this.findAllHotels();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      })
    });
  }

  onViewButtonClick(hotelId: number) {
    this._hotelService.findById(hotelId).subscribe({
      next: (hotel) => {
        this.openDialog('view', hotel);
      }
    })
  }

  onEditButtonClick(hotelId: number) {
    this._hotelService.findById(hotelId).subscribe({
      next: (hotel) => {
        this.openDialog('update', hotel, (result) => {
          this._hotelService.updateHotel(hotelId, result.data).subscribe({
            next: () => {
              this._snackBarServce.showSnackBar('Hotel atualizado com sucesso!', 'Fechar');
              this.findAllHotels();
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

  private openDialog(option: 'view' | 'create' | 'update', hotel?: IHotelDetailResponse, callback?: (result: any) => void, ) {
    const data = this.buildDialogData(option, hotel);
    const dialogRef = this._matDialog.open(HotelDialogComponent, {
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (!callback) return;
      callback(result);
    });
  }

  private buildDialogData(option: 'view' | 'create' | 'update', hotel?: IHotelDetailResponse) {
    switch (option) {
      case 'view':
        return { hotel, isCreateForm: false, isUpdateForm: false, isView: true };
      case 'create':
        return { isCreateForm: true, isUpdateForm: false, isView: false };
      case 'update':
        return { hotel, isCreateForm: false, isUpdateForm: true, isView: false };
    }
  }

  private findAllHotels(page: number = 1, size: number = 10, query: string = '') {
    this.hotels$ = this._hotelService.findAllHotels(page, size, query);
  }
 
  private createHotelQueryForm() {
    this.searchForm = this._fb.group({
      query: ['']
    });
  }

}
