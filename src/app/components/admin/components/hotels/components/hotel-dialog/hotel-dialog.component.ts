import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { ViaCepService } from '../../../../../../services/via-cep.service';
import { IFileHandle } from '../../../../../../interfaces/images/file-handle.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IHotelDetailResponse } from '../../../../../../interfaces/hotel/hotel-detail-response.interface';
import { IImageResponse } from '../../../../../../interfaces/images/image-response.interface';
import { IBaseHotelResponse } from '../../../../../../interfaces/hotel/base-hotel-response.interface';
import { getHotelFullAddress } from '../../../../../../utils/hotel-utils';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-hotel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    MatDialogModule,
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './hotel-dialog.component.html',
  styleUrl: './hotel-dialog.component.scss'
})
export class HotelDialogComponent implements OnInit {

  dialogTitle: string = 'Visualizar Hotel';
  buttonAction: string = 'Salvar';
  isCreateForm: boolean = false;
  isUpdateForm: boolean = false;
  isView: boolean = false;
  hotelData: IHotelDetailResponse = {} as IHotelDetailResponse;
  imagesIdsForDelete: number[] = [];

  hotelForm: FormGroup = {} as FormGroup;
  images: IFileHandle[] = [];
  requiredImageError: boolean = false;

  private readonly _fb = inject(FormBuilder);
  private readonly _viaCepService = inject(ViaCepService);
  private readonly _domSanitized = inject(DomSanitizer);
  private readonly _dialogRef = inject(MatDialogRef<HotelDialogComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this._data.isCreateForm) {
      this.dialogTitle = 'Cadastrar Hotel';
      this.buttonAction = 'Cadastrar';
      this.isCreateForm = true;
      this.createForm();
    }
    if (this._data.isUpdateForm) {
      this.dialogTitle = 'Atualizar Hotel';
      this.buttonAction = 'Atualizar';
      this.isUpdateForm = true;
      this.createForm();
      this.hotelData = this._data.hotel;
      this.hotelForm.patchValue({
        name: this.hotelData.name,
        description: this.hotelData.description,
        roomQuantity: this.hotelData.roomQuantity,
        zipCode: this.hotelData.zipCode,
        street: this.hotelData.street,
        number: this.hotelData.number,
        city: this.hotelData.city,
        state: this.hotelData.state,
        phone: this.hotelData.phone
      });
      this.images = this.hotelData.images.map((image: IImageResponse) => {
        return {
          file: null,
          url: image.base64Image
        }
      })
    }
    if (this._data.isView) {
      this.dialogTitle = 'Visualizar Hotel';
      this.isView = true;
      this.hotelData = this._data.hotel;
    }
  }

  get name(): FormControl {
    return this.hotelForm.get('name') as FormControl;
  }
  get description(): FormControl {
    return this.hotelForm.get('description') as FormControl;
  }
  get roomQuantity(): FormControl {
    return this.hotelForm.get('roomQuantity') as FormControl;
  }
  get street(): FormControl {
    return this.hotelForm.get('street') as FormControl;
  }
  get number(): FormControl {
    return this.hotelForm.get('number') as FormControl;
  }
  get city(): FormControl {
    return this.hotelForm.get('city') as FormControl;
  }
  get zipCode(): FormControl {
    return this.hotelForm.get('zipCode') as FormControl;
  }
  get state(): FormControl {
    return this.hotelForm.get('state') as FormControl;
  }
  get phone(): FormControl {
    return this.hotelForm.get('phone') as FormControl;
  }

  getAddressFromViaCep() {
    if (this.zipCode.valid) {
      this._viaCepService.getAddressInfos(this.zipCode.value).subscribe({
        next: (response) => {
          this.street.setValue(response.logradouro);
          this.city.setValue(response.localidade);
          this.state.setValue(response.uf);
          this.street.updateValueAndValidity();
          this.city.updateValueAndValidity();
          this.state.updateValueAndValidity();
        },
        error: (error) => {
          console.error('Error fetching address:', error);
        }
      });
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
        url: this._domSanitized.bypassSecurityTrustUrl(window.URL.createObjectURL(input.files![i] as File))
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
      this.imagesIdsForDelete.push(this.hotelData.images[index].id);
    }
  }

  onCloseDialog() {
    if (this.hotelForm.invalid || this.images.length === 0) {
      this.hotelForm.markAllAsTouched();
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
    formData.append('request', new Blob([JSON.stringify(this.getHotelFormValue())], { type: 'application/json' }));
    if (this.images.length > 0) {
      this.images.forEach(imageFile => {
        if (imageFile.file) {
          formData.append('images', imageFile.file);
        }
      })
    }
    return formData;
  }

  private getHotelFormValue() {
    return {
      name: this.name.value,
      description: this.description.value,
      roomQuantity: this.roomQuantity.value,
      zipCode: /^[0-9]{5,5}-[0-9]{3,3}$/.test(this.zipCode.value) ? this.zipCode.value : `${this.zipCode.value.substring(0, 5)}-${this.zipCode.value.substring(5)}`,
      street: this.street.value,
      number: this.number.value,
      city: this.city.value,
      state: this.state.value,
      phone: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(this.phone.value.trim()) ? this.phone.value : `(${this.phone.value.substring(0,2)}) ${this.phone.value.substring(2, 6)}-${this.phone.value.substring(6)}`
    }
  }

  private createForm() {
    this.hotelForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      roomQuantity: ['', Validators.required],
      zipCode: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', Validators.required]
    })
  }
 
}
