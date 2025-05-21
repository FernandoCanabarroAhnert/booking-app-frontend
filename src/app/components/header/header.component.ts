import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;

  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
      this.listenToAuthState();
  }

  listenToAuthState(): void {
    this._authService.isAuthenticated$.subscribe(value => this.isAuthenticated = value);
  }

  logout(): void {
    this._authService.logout();
  }

}
