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
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  sort: string = 'id,asc';

  private readonly _roomService = inject(RoomService);

  ngOnInit(): void {
    this.rooms$ = this._roomService.findAllRooms(1, 12);
  }

  onRoomFilterSubmit(filter: IRoomFilterResponse) {
    this.filter = filter;
    this.rooms$ = this._roomService.findAllRoomsWithFilter(1, 12, filter.checkIn, filter.checkOut, filter.city, filter.capacity, filter.types);
  }

  onPageChange(page: number) {
    if (this.filter) {
      this.rooms$ = this._roomService.findAllRoomsWithFilter(page, 12, this.filter.checkIn, this.filter.checkOut, 
        this.filter.city, this.filter.capacity, this.filter.types);
    }
    else this.rooms$ = this._roomService.findAllRooms(page, 12);
  }

  onPriceSort() {
    this.priceSortDirection = this.priceSortDirection === 'asc' ? 'desc' : 'asc';
    this.tooltipText = this.priceSortDirection === 'asc' ? 'decrescente' : 'ascendente';
    this.sort = `pricePerNight,${this.priceSortDirection}`;
    if (this.filter) {
      this.rooms$ = this._roomService.findAllRoomsWithFilter(1, 12, this.filter.checkIn, this.filter.checkOut, 
        this.filter.city, this.filter.capacity, this.filter.types, this.sort);
    }
    else {
      this.rooms$ = this._roomService.findAllRooms(1, 12, this.sort);
    }
  }

}
