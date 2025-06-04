import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IRoomRatingResponse } from '../../../../../../interfaces/room/room-rating-response.interface';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-room-rating',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './room-rating.component.html',
  styleUrl: './room-rating.component.scss'
})
export class RoomRatingComponent {

  @Input({ required: true })
  rating!: IRoomRatingResponse;
  @Input({ required: true })
  isManagementMode: boolean = false;
  @Output()
  onUpdateClickEmitter = new EventEmitter<number>();
  @Output()
  onDeleteClickEmitter = new EventEmitter<number>();

  onUpdateClick(roomRatingId: number): void {
    this.onUpdateClickEmitter.emit(roomRatingId);
  }

  onDeleteClick(roomRatingId: number): void {
    this.onDeleteClickEmitter.emit(roomRatingId);
  }

}
