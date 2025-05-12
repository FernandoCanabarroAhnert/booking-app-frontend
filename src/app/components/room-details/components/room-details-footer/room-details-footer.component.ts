import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-room-details-footer',
  standalone: true,
  imports: [],
  templateUrl: './room-details-footer.component.html',
  styleUrl: './room-details-footer.component.scss'
})
export class RoomDetailsFooterComponent {

  @Input({ required: true })
  capacity: number = 1;

}
