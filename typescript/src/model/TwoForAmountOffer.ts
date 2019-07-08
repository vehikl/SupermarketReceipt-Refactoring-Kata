import { Product } from "./Product"
import { Discount } from "./Discount"
import { Offer } from "./Offer"

export class TwoForAmountOffer {
  private minimumQuantityForOffer: number = 2;
  private product: Product;
  private unitPrice: number;

  public constructor(product: Product, unitPrice: number) {
    this.product = product;
    this.unitPrice = unitPrice;
  }

  public getDiscount(quantityAsInt: number, offer: Offer, quantity: number) {
    const total = offer.argument * Math.floor(quantityAsInt / this.minimumQuantityForOffer) + quantityAsInt % 2 * this.unitPrice;
    const discountAmount = this.unitPrice * quantity - total;
    return new Discount(this.product, "2 for " + offer.argument, discountAmount);
  }
}