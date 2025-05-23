import { Component, inject, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../footer/footer.component';
import { RoomDetailsFooterComponent } from './components/room-details-footer/room-details-footer.component';
import { IRoomDetailResponse } from '../../interfaces/room/room-detail-response.interface';
import { RoomService } from '../../services/room.service';
import { CommonModule } from '@angular/common';
import { RoomTypePipe } from '../../pipes/room-type.pipe';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';
import { RoomDetailsRatingsComponent } from './components/room-details-ratings/room-details-ratings.component';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    HeaderComponent, 
    BookingFormComponent, 
    MatIconModule,
    FooterComponent,
    RoomDetailsFooterComponent,
    CommonModule,
    RoomTypePipe,
    StarsRatingComponent,
    RoomDetailsRatingsComponent
  ],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss'
})
export class RoomDetailsComponent implements OnInit {

  @Input()
  roomId!: number;
  room: IRoomDetailResponse = {} as IRoomDetailResponse;

  private readonly _roomService = inject(RoomService);
  
  ngOnInit(): void {
    this._roomService.findById(this.roomId).subscribe(response => {
      this.room = response;
    });
  }

  hotelFullAddress(): string {
    return `${this.room.hotel.street}, ${this.room.hotel.number} - ${this.room.hotel.city}/${this.room.hotel.state} - ${this.room.hotel.zipCode}`;
  }

}
