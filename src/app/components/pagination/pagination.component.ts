import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input({ required: true })
  currentPage: number = 1;
  @Input({ required: true })
  totalPages: number = 1;
  @Input({ required: true })
  numberOfElements: number = 0;
  @Input({ required: true })
  totalElements: number = 0;
  @Output()
  onPageChangeEmitter = new EventEmitter<number>();

  onPageChange(page: number) {
    this.onPageChangeEmitter.emit(page);
  }

  returnArrayForIteration(items: number) {
    return Array.from({ length: items }, (_, i) => i + 1);
  }

}
