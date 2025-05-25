import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  isAdmin: boolean = false;
  isOnlyOperator: boolean = false;

  userFullName: string = '';
  
  ngOnInit(): void {
    this.obtainCurrentUserAuthority();
    this.obtainUserFullName();
  }

  obtainCurrentUserAuthority() {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
  }

  obtainUserFullName() {
    this._authService.getMe().subscribe(user => {
      this.userFullName = user.fullName;
    })
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login/admin']);
  }

}
