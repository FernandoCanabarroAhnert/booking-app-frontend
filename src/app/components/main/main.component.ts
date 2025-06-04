import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RoomService } from '../../services/room.service';
import { RoomList } from '../../types/room-list.type';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { HotelList } from '../../types/hotel-list.type';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  rooms$!: Observable<RoomList>;
  hotels$!: Observable<HotelList>;

  private readonly _elementRef = inject(ElementRef);
  private readonly _roomService = inject(RoomService);
  private readonly _hotelService = inject(HotelService);

  ngOnInit(): void {
    this.configureSwiper('#rooms-swiper-container');
    this.configureSwiper('#hotels-swiper-container');
    this.rooms$ = this._roomService.findAllRooms(1, 10).pipe(map(response => response.content));
    this.hotels$ = this._hotelService.findAllHotels(1, 10).pipe(map(response => response.content));
  }

  configureSwiper(element: string) {
    const swiperEl = this._elementRef.nativeElement.querySelector(element);
    Object.assign(swiperEl, {
      pagination: {
        clickable: true,
      },
      breakpoints: {
        400: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });
    swiperEl.initialize();
  }

}
