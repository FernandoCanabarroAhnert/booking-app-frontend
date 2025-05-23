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

  isAdmin: boolean = false;
  isOnlyOperator: boolean = false;
  userFullName: string = '';

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this.obtainCurrentUserAuthority();
    this.obtainUserFullName();
  }

  obtainCurrentUserAuthority() {
    this._authService.isAdminRole$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this._authService.isOnlyOperatorRole$.subscribe(isOnlyOperator => {
      this.isOnlyOperator = isOnlyOperator;
    });
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
