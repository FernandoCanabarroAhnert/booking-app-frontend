import { Component, inject, Input, OnInit } from '@angular/core';
import { RoomService } from '../../../../services/room.service';
import { Observable } from 'rxjs';
import { IPageResponse } from '../../../../interfaces/page/page-response.interface';
import { RoomRatingList } from '../../../../types/room-rating-list.type';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RoomRatingComponent } from './components/room-rating/room-rating.component';

@Component({
  selector: 'app-room-details-ratings',
  standalone: true,
  imports: [
    PaginationComponent,
    CommonModule,
    RoomRatingComponent
  ],
  templateUrl: './room-details-ratings.component.html',
  styleUrl: './room-details-ratings.component.scss'
})
export class RoomDetailsRatingsComponent implements OnInit {

  @Input({ required: true })
  roomId!: number;

  ratingsResponse!: Observable<IPageResponse<RoomRatingList>>;

  private readonly _roomService = inject(RoomService);

  ngOnInit(): void {
    this.getRatings();
  }

  getRatings(page: number = 1, size: number = 9) {
    this.ratingsResponse = this._roomService.findAllRatingsByRoomId(this.roomId, page, size);
  }

  onPageChange(page: number) {
    this.getRatings(page);
  }

}
