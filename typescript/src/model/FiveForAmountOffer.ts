import { Product } from "./Product"
import { Discount } from "./Discount"
import { ShoppingCart } from "./ShoppingCart";

export class FiveForAmountOffer {
  private minimumQuantityForOffer: number = 5;
  private product: Product;
  private unitPrice: number;
  private discountedPrice: number;

  public constructor(product: Product, unitPrice: number, discountedPrice: number) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.discountedPrice = discountedPrice;
  }

  public getDiscount(cart: ShoppingCart) {
    const quantity = cart.getQuantityOf(this.product).quantity;
    const total = this.discountedPrice * Math.floor(quantity / this.minimumQuantityForOffer) + quantity % this.minimumQuantityForOffer * this.unitPrice;
    const discountAmount = this.unitPrice * quantity - total;
    return new Discount(this.product, `${this.minimumQuantityForOffer} for ${this.discountedPrice}`, discountAmount);
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product).quantity >= this.minimumQuantityForOffer;
  }
}