import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RoomCardComponent } from '../room-card/room-card.component';
import { RoomFilterComponent } from '../room-filter/room-filter.component';
import { HeaderComponent } from '../header/header.component';
import { IRoomFilterResponse } from '../../interfaces/room/room-filter-response.interface';
import { RoomService } from '../../services/room.service';
import { RoomList } from '../../types/room-list.type';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../interfaces/page/page-response.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    RoomCardComponent,
    RoomFilterComponent,
    HeaderComponent,
    PaginationComponent,
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {

  rooms$!: Observable<IPageResponse<RoomList>>;
  filter!: IRoomFilterResponse;

  priceSortDirection: 'asc' | 'desc' = 'asc';
  tooltipText: 'decrescente' | 'ascendente' = 'decrescente';

  queryStringHotelId!: number;

  sort: string = 'id,asc';

  private readonly _roomService = inject(RoomService);
  private readonly _hotelService = inject(HotelService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _pageSize = 12;

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const hotelId = params['hotelId'];
      if (hotelId) {
        this.queryStringHotelId = +hotelId;
        this.rooms$ = this._hotelService.findAllRoomsByHotelId(this.queryStringHotelId, 1, this._pageSize);
      } else {
        this.queryStringHotelId = undefined!;
        this.rooms$ = this._roomService.findAllRooms(1, this._pageSize);
      }
    });
  }

  onRoomFilterSubmit(filter: IRoomFilterResponse) {
    this.filter = filter;
    this.rooms$ = this._roomService.findAllRoomsWithFilter(1, this._pageSize, filter.checkIn, filter.checkOut, filter.city, filter.capacity, filter.types, this.queryStringHotelId);
  }

  onPageChange(page: number) {
    if (this.filter) {
      this.rooms$ = this._roomService.findAllRoomsWithFilter(page, this._pageSize, this.filter.checkIn, this.filter.checkOut, 
        this.filter.city, this.filter.capacity, this.filter.types, this.queryStringHotelId, this.sort);
    }
    else if (this.queryStringHotelId) {
      this.rooms$ = this._hotelService.findAllRoomsByHotelId(this.queryStringHotelId, page, this._pageSize, this.sort);
    }
    else {
      this.rooms$ = this._roomService.findAllRooms(page, this._pageSize, this.sort);
    }
  }

  onPriceSort() {
    this.priceSortDirection = this.priceSortDirection === 'asc' ? 'desc' : 'asc';
    this.tooltipText = this.priceSortDirection === 'asc' ? 'decrescente' : 'ascendente';
    this.sort = `pricePerNight,${this.priceSortDirection}`;
    if (this.filter) {
      this.rooms$ = this._roomService.findAllRoomsWithFilter(1, this._pageSize, this.filter.checkIn, this.filter.checkOut, 
        this.filter.city, this.filter.capacity, this.filter.types, this.queryStringHotelId, this.sort);
    }
    else if (this.queryStringHotelId) {
      this.rooms$ = this._hotelService.findAllRoomsByHotelId(this.queryStringHotelId, 1, this._pageSize, this.sort);
    }
    else {
      this.rooms$ = this._roomService.findAllRooms(1, this._pageSize, this.sort);
    }
  }

}
