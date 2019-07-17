import { Product } from "../Product"
import { Discount } from "../Discount"
import { ShoppingCart } from "../ShoppingCart";
import OfferInterface from './OfferInterface';

export class TwoForAmountOffer implements OfferInterface {
  private minimumQuantityForOffer: number = 2;
  private product: Product;
  private unitPrice: number;
  private discountedPrice: number;

  public constructor(product: Product, unitPrice: number, discountedPrice: number) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.discountedPrice = discountedPrice;
  }

  public getDiscount(cart: ShoppingCart) {
    const quantity = cart.getQuantityOf(this.product);
    const total = this.discountedPrice * Math.floor(quantity / this.minimumQuantityForOffer) + quantity % 2 * this.unitPrice;
    const discountAmount = this.unitPrice * quantity - total;
    return new Discount(this.product, "2 for " + this.discountedPrice, discountAmount);
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product) >= 2;
  }
}