import { Pipe, PipeTransform } from '@angular/core';
import { PaymentTypeEnum } from '../enums/payment-type.enum';

@Pipe({
  name: 'paymentType',
  standalone: true
})
export class PaymentTypePipe implements PipeTransform {

  transform(value: number): string {
    const paymentTypeEnumMap: { [key in PaymentTypeEnum]: string } = {
      [PaymentTypeEnum.DINHEIRO]: 'Dinheiro',
      [PaymentTypeEnum.CARTAO]: 'Cartão',
      [PaymentTypeEnum.PIX]: 'Pix',
      [PaymentTypeEnum.BOLETO]: 'Boleto'
    }
    return paymentTypeEnumMap[value as PaymentTypeEnum];
  }

}
