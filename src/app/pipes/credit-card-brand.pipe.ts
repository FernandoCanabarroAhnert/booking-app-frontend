import { Pipe, PipeTransform } from '@angular/core';
import { CreditCardBrandEnum } from '../enums/credit-card-brand.enum';

@Pipe({
  name: 'creditCardBrand',
  standalone: true
})
export class CreditCardBrandPipe implements PipeTransform {

  transform(value: number): string {
    const creditCardBrandMap: { [key: number]: string } = {
      [CreditCardBrandEnum.VISA]: 'Visa',
      [CreditCardBrandEnum.MASTERCARD]: 'MasterCard'
    };
    return creditCardBrandMap[value as CreditCardBrandEnum];
  }

}
