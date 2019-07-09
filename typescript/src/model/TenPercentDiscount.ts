import { ShoppingCart } from "./ShoppingCart";
import { Product } from "./Product";
import { Discount } from "./Discount";

export class TenPercentDiscount {
  private product: Product;
  private unitPrice: number;

  public constructor(product: Product, unitPrice: number) {
    this.product = product;
    this.unitPrice = unitPrice;
  }

  public getDiscount(quantity: number): Discount {
    return new Discount(this.product, "10% off", quantity * this.unitPrice * .1);
  }

  public applies(cart: ShoppingCart): boolean {
    return cart.getQuantityOf(this.product).quantity >= 1;
  }
}