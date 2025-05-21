import { CreditCardBrandPipe } from './credit-card-brand.pipe';

describe('CreditCardBrandPipe', () => {
  it('create an instance', () => {
    const pipe = new CreditCardBrandPipe();
    expect(pipe).toBeTruthy();
  });
});
