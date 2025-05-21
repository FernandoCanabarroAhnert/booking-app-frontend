import { Pipe, PipeTransform } from '@angular/core';
import { PaymentTypeEnum } from '../enums/payment-type.enum';
import { paymentTypeEnumMap } from '../utils/payment-type-enum-map';

@Pipe({
  name: 'paymentType',
  standalone: true
})
export class PaymentTypePipe implements PipeTransform {

  transform(value: number): string {
    return paymentTypeEnumMap[value as PaymentTypeEnum];
  }

}
