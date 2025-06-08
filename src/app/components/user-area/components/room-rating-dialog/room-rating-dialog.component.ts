import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-room-rating-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './room-rating-dialog.component.html',
  styleUrl: './room-rating-dialog.component.scss'
})
export class RoomRatingDialogComponent implements OnInit {

  roomRatingForm: FormGroup = {} as FormGroup;
  isCreate: boolean = false;
  isUpdate: boolean = false;

  private readonly _dialogRef = inject(MatDialogRef);
  private readonly _data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.isCreate = this._data.isCreate;
    this.isUpdate = this._data.isUpdate;
    this.createForm();
  }

  createForm() {
    this.roomRatingForm = new FormGroup({
      rating: new FormControl(this.isCreate ? null : this._data.roomRating.rating, Validators.required),
      description: new FormControl(this.isCreate ? '' : this._data.roomRating.description, Validators.required)
    })
  }

  get rating(): FormControl {
    return this.roomRatingForm.get('rating') as FormControl;
  }
  get description(): FormControl {
    return this.roomRatingForm.get('description') as FormControl;
  }

  onSubmit() {
    if (this.roomRatingForm.invalid) {
      this.roomRatingForm.markAllAsTouched();
      return;
    }
    this._dialogRef.close(this.roomRatingForm.value);
  }

}
