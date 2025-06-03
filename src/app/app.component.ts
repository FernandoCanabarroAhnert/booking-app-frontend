import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    LoadingComponent,
    CommonModule,
    HotelDetailsComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  showLoading = false;

  private readonly _loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading() {
    this._loadingService.loading$
      .pipe(delay(0))
      .subscribe(value => this.showLoading = value);
  }

}
