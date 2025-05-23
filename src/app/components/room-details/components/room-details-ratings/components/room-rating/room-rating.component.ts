import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IRoomRatingResponse } from '../../../../../../interfaces/room/room-rating-response.interface';

@Component({
  selector: 'app-room-rating',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './room-rating.component.html',
  styleUrl: './room-rating.component.scss'
})
export class RoomRatingComponent {

  @Input({ required: true })
  rating!: IRoomRatingResponse;

}
