import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-area',
  standalone: true,
  imports: [
    HeaderComponent,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './user-area.component.html',
  styleUrl: './user-area.component.scss'
})
export class UserAreaComponent {

}
