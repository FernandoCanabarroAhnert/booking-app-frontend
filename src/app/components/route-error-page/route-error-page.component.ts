import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-error-page',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './route-error-page.component.html',
  styleUrl: './route-error-page.component.scss'
})
export class RouteErrorPageComponent implements OnInit {

  error: string = '';
  message: string = '';

  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(data => {
      this.error = data['error'];
      this.message = this.error === 'Página não encontrada'
        ? 'A página que você está tentando acessar não existe.'
        : 'Você não tem permissão para acessar esta página.';
    });
  }

}
