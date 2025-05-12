import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoomDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
