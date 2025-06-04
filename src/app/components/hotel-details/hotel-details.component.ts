import { Component, inject, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HotelService } from '../../services/hotel.service';
import { IHotelDetailResponse } from '../../interfaces/hotel/hotel-detail-response.interface';
import { getHotelFullAddress } from '../../utils/hotel-utils';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [
    HeaderComponent, 
    FooterComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent implements OnInit {

  @Input()
  hotelId!: number;
  hotel!: IHotelDetailResponse;

  private readonly _hotelService = inject(HotelService);

  ngOnInit(): void {
    this._hotelService.findById(this.hotelId).subscribe(response => this.hotel = response);
  }

  hotelFullAddress() {
    return getHotelFullAddress(this.hotel);
  }

}
