import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRoomDetailResponse } from '../../../../../../interfaces/room/room-detail-response.interface';
import { IFileHandle } from '../../../../../../interfaces/images/file-handle.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IBaseHotelResponse } from '../../../../../../interfaces/hotel/base-hotel-response.interface';
import { IImageResponse } from '../../../../../../interfaces/images/image-response.interface';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoomTypePipe } from '../../../../../../pipes/room-type.pipe';
import { getHotelFullAddress } from '../../../../../../utils/hotel-utils';
import { AuthService } from '../../../../../../services/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IHotelSearchResponse } from '../../../../../../interfaces/hotel/hotel-search-response.interface';
import { map, Observable, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-room-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIcon,
    MatTooltipModule,
    RoomTypePipe,
    MatAutocompleteModule,
    MatSelectModule,
    RoomTypePipe,
    NgxMaskDirective
  ],
  templateUrl: './room-dialog.component.html',
  styleUrl: './room-dialog.component.scss'
})
export class RoomDialogComponent {

  dialogTitle: string = 'Visualizar Hotel';
  buttonAction: string = 'Salvar';
  isCreateForm: boolean = false;
  isUpdateForm: boolean = false;
  isView: boolean = false;
  roomData: IRoomDetailResponse = {} as IRoomDetailResponse;
  imagesIdsForDelete: number[] = [];

  isOnlyOperator: boolean = false;
  operatorWorkingHotelId: number = 0;
  isAdmin: boolean = false;

  roomForm: FormGroup = {} as FormGroup;
  images: IFileHandle[] = [];
  requiredImageError: boolean = false;

  hotelsList: IHotelSearchResponse[] = [];
  filteredHotelsList!: Observable<IHotelSearchResponse[]>;

  roomTypes = [1, 2, 3];

  private readonly _fb = inject(FormBuilder);
  private readonly _domSanitizer = inject(DomSanitizer);
  private readonly _dialogRef = inject(MatDialogRef<RoomDialogComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this.obtainUserAuthority();
    if (this.isOnlyOperator) this.getOperatorWorkingHotelId();
    this.setDialogData();
    this.filteredHotelsList = this.hotel.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.hotelsList.slice();
      }),
    );
  }

  get number(): FormControl {
    return this.roomForm.get('number') as FormControl;
  }
  get floor(): FormControl {
    return this.roomForm.get('floor') as FormControl;
  }
  get type(): FormControl {
    return this.roomForm.get('type') as FormControl;
  }
  get pricePerNight(): FormControl {
    return this.roomForm.get('pricePerNight') as FormControl;
  }
  get description(): FormControl {
    return this.roomForm.get('description') as FormControl;
  }
  get capacity(): FormControl {
    return this.roomForm.get('capacity') as FormControl;
  }
  get hotel(): FormControl {
    return this.roomForm.get('hotel') as FormControl;
  }

  displayFn(hotel: IHotelSearchResponse): string {
    return hotel && hotel.name ? hotel.name : '';
  }

  setDialogData() {
    if (this._data.isCreateForm) {
      this.dialogTitle = 'Cadastrar Quarto';
      this.buttonAction = 'Cadastrar';
      this.isCreateForm = true;
      this.hotelsList = this._data.hotelsList;
      this.createForm();
    }
    if (this._data.isUpdateForm) {
      this.dialogTitle = 'Atualizar Quarto';
      this.buttonAction = 'Atualizar';
      this.isUpdateForm = true;
      this.hotelsList = this._data.hotelsList;
      this.createForm();
      this.roomData = this._data.room;
      this.roomForm.patchValue({
        number: this.roomData.number,
        floor: this.roomData.floor,
        type: this.roomData.type,
        pricePerNight: this.roomData.pricePerNight,
        description: this.roomData.description,
        capacity: this.roomData.capacity,
        hotel: { id: this.roomData.hotel.id, name: this.roomData.hotel.name } as IHotelSearchResponse
      });
      this.images = this.roomData.images.map((image: IImageResponse) => {
        return {
          file: null,
          url: image.base64Image
        }
      })
    }
    if (this._data.isView) {
      this.dialogTitle = 'Visualizar Quarto';
      this.isView = true;
      this.roomData = this._data.room;
    }
  }
  
  watchImageInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.requiredImageError = true;
      return;
    }
    for (let i = 0; i < input.files.length; i++) {
      this.images.push({
        file: input.files![i] as File,
        url: this._domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(input.files![i] as File))
      })
    }
    this.requiredImageError = false;
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    if (this.images.length === 0) {
      this.requiredImageError = true;
    }
    if (this.isUpdateForm) {
      this.imagesIdsForDelete.push(this.roomData.images[index].id);
    }
  }

  onCloseDialog() {
    if (this.roomForm.invalid || this.images.length === 0) {
      this.roomForm.markAllAsTouched();
      if (this.images.length === 0) {
        this.requiredImageError = true;
      }
      return;
    }
    this._dialogRef.close({ data: this.prepareFormData(), imagesIdsForDelete: this.imagesIdsForDelete });
  }

  getHotelFullAddress(hotel: IBaseHotelResponse): string {
    return getHotelFullAddress(hotel);
  }

  private prepareFormData() {
    const formData: FormData = new FormData();
    formData.append('request', new Blob([JSON.stringify(this.getRoomFormValue())], { type: 'application/json' }));
    if (this.images.length > 0) {
      this.images.forEach(imageFile => {
        if (imageFile.file) {
          formData.append('images', imageFile.file);
        }
      })
    }
    return formData;
  }

  private getRoomFormValue() {
    return {
      number: this.number.value,
      floor: this.floor.value,
      type: this.type.value,
      pricePerNight: this.pricePerNight.value,
      description: this.description.value,
      capacity: this.capacity.value,
      hotelId: this.isOnlyOperator ? this.operatorWorkingHotelId : this.hotel.value.id,
    }
  }

  private createForm() {
    this.roomForm = this._fb.group({
      number: ['', Validators.required],
      floor: [null, Validators.required],
      type: [null, Validators.required],
      pricePerNight: [null, Validators.required],
      description: ['', Validators.required],
      capacity: [null, Validators.required],
      hotel: new FormControl<string | IHotelSearchResponse>('')
    })
  }

  private _filter(name: string): IHotelSearchResponse[] {
    const filterValue = name.toLowerCase();
    return this.hotelsList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private obtainUserAuthority() {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
  }

  private getOperatorWorkingHotelId() {
    this._authService.getMe().subscribe(user => this.operatorWorkingHotelId = user.workingHotelId);
  }


}
