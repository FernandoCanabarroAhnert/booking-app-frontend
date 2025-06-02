import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../interfaces/page/page-response.interface';
import { IHotelResponse } from '../../interfaces/hotel/hotel-response.interface';
import { HotelList } from '../../types/hotel-list.type';
import { HotelCardComponent } from '../hotel-card/hotel-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    HeaderComponent,
    PaginationComponent,
    HotelCardComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent implements OnInit {

  hotels$!: Observable<IPageResponse<HotelList>>;

  private readonly _hotelService = inject(HotelService);

  ngOnInit(): void {
    this.findAllHotels(1);
  }

  findAllHotels(page: number) {
    this.hotels$ = this._hotelService.findAllHotels(page, 12);
  }

}
