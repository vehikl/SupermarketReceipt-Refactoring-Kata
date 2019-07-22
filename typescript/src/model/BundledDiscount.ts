import { Product } from "./Product"
import DiscountInterface from "./DiscountInterface"

export default class BundledDiscount implements DiscountInterface {

  constructor(private readonly products: Product[],
    private readonly description: string,
    private readonly discountAmount: number) {
  }

  getProductPresentation(): string {
    return this.products.map(product => product.name).join(' & ');
  }

  getDescription(): string {
    return this.description;
  }

  getDiscountAmount(): number {
    return this.discountAmount;
  }
}
