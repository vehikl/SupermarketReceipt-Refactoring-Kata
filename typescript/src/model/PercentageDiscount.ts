import { ShoppingCart } from "./ShoppingCart";
import { Product } from "./Product";
import { Discount } from "./Discount";

export class PercentageDiscount {
  private product: Product;
  private unitPrice: number;
  private percentageOff: number;

  public constructor(product: Product, unitPrice: number, percentageOff: number) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.percentageOff = percentageOff;
  }

  public getDiscount(quantity: number): Discount {
    return new Discount(this.product, this.percentageOff + "% off", (quantity * this.unitPrice * this.percentageOff) / 100 );
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product).quantity >= 1;
  }
}