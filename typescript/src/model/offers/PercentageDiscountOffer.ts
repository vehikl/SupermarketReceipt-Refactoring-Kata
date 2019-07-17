import { ShoppingCart } from "../ShoppingCart";
import { Product } from "../Product";
import { Discount } from "../Discount";
import OfferInterface from './OfferInterface';

export class PercentageDiscountOffer implements OfferInterface {
  private product: Product;
  private unitPrice: number;
  private percentageOff: number;

  public constructor(product: Product, unitPrice: number, percentageOff: number) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.percentageOff = percentageOff;
  }

  public getDiscount(cart: ShoppingCart): Discount {
    const quantity = cart.getQuantityOf(this.product);
    return new Discount(this.product, this.percentageOff + "% off", (quantity * this.unitPrice * this.percentageOff) / 100 );
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product) >= 1;
  }
}