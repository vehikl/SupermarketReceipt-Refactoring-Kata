import { BundledDiscount } from '../../src/model/BundledDiscount';
import { Product } from '../../src/model/Product';
import { ProductUnit } from '../../src/model/ProductUnit';

describe('BundledDiscount', () => {
  it('can get the product descriptions', () => {
    const toothbrush: Product = new Product('toothbrush', ProductUnit.Each);
    const toothpaste: Product = new Product('toothpaste', ProductUnit.Each);

    const products: Product[] = [toothbrush, toothpaste];
    const description: string = '';
    const presentation: string = 'toothbrush & toothpaste';
    const discountAmount: number = 0;
    const bundledDiscount: BundledDiscount = new BundledDiscount(products, description, discountAmount);

    expect(bundledDiscount.getProductPresentation()).toEqual(presentation);
    expect(bundledDiscount.getDescription()).toEqual(description);
    expect(bundledDiscount.getDiscountAmount()).toEqual(discountAmount);
  });
});
