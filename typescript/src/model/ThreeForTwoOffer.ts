import { Product } from "./Product"
import { Discount } from "./Discount"
import { Offer } from "./Offer"
import { SpecialOfferType } from "./SpecialOfferType";
import { ShoppingCart } from "./ShoppingCart";
import OfferInterface from './OfferInterface';

export class ThreeForTwoOffer implements OfferInterface {
  private minimumQuantityForOffer: number = 3;
  private product: Product;
  private unitPrice: number;

  public constructor(product: Product, unitPrice: number) {
    this.product = product;
    this.unitPrice = unitPrice;
  }

  public getDiscount(cart: ShoppingCart) {
    const quantity = cart.getQuantityOf(this.product).quantity;
    const maybeDiscountMultiple = Math.floor(quantity / this.minimumQuantityForOffer);
    const discountAmount = quantity * this.unitPrice - ((maybeDiscountMultiple * 2 * this.unitPrice) + quantity % 3 * this.unitPrice);

    return new Discount(this.product, "3 for 2", discountAmount);
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product).quantity > 2;
  }
}