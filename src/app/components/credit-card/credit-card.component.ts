import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICreditCardResponse } from '../../interfaces/credit-card-response.interface';
import { CreditCardBrandPipe } from '../../pipes/credit-card-brand.pipe';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [
    CreditCardBrandPipe,
    MatRadioModule
  ],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss'
})
export class CreditCardComponent {

  @Input({ required: true })
  creditCard!: ICreditCardResponse;


}
