import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICreditCardResponse } from '../../interfaces/credit-card/credit-card-response.interface';
import { CreditCardBrandPipe } from '../../pipes/credit-card-brand.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [
    CreditCardBrandPipe,
    MatRadioModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss'
})
export class CreditCardComponent {

  @Input({ required: true })
  creditCard!: ICreditCardResponse;
  @Input({ required: true })
  isManagementMode: boolean = false;
  @Output()
  onDeleteCreditCardEmitter = new EventEmitter<number>();

  onDeleteClick(id: number) {
    this.onDeleteCreditCardEmitter.emit(id);
  }

}
