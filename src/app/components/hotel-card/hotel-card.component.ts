import { Component, Input } from '@angular/core';
import { IHotelResponse } from '../../interfaces/hotel/hotel-response.interface';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss'
})
export class HotelCardComponent {

  @Input({ required: true })
  hotel!: IHotelResponse;

  getHotelFullAddress(hotel: IHotelResponse) {
    return `${hotel.street}, ${hotel.number} - ${hotel.city}/${hotel.state}`;
  }

}
