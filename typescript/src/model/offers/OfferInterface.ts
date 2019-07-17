import { Discount } from "../Discount"
import { ShoppingCart } from "../ShoppingCart";

interface OfferInterface {
  getDiscount(cart: ShoppingCart): Discount;
  applies(cart: ShoppingCart): boolean;
}

export default OfferInterface;