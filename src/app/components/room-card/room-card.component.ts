import { Component, Input } from '@angular/core';
import { IRoomResponse } from '../../interfaces/room/room-response.interface';
import { RoomTypePipe } from '../../pipes/room-type.pipe';
import { CommonModule } from '@angular/common';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    RoomTypePipe,
    CommonModule,
    StarsRatingComponent
  ],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.scss'
})
export class RoomCardComponent {

  @Input({ required: true })
  room!: IRoomResponse;

}
