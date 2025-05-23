import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars-rating',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stars-rating.component.html',
  styleUrl: './stars-rating.component.scss'
})
export class StarsRatingComponent {

  @Input({ required: true })
  rating: number = 0;

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 >= 0.25 && this.rating % 1 < 0.75;
  }

  get emptyStars(): number[] {
    const full = Math.floor(this.rating);
    const half = this.hasHalfStar ? 1 : 0;
    return Array(5 - full - half).fill(0);
  }

}
