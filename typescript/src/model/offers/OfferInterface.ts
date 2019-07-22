import { ShoppingCart } from "../ShoppingCart";
import DiscountInterface from "../DiscountInterface";

interface OfferInterface {
  getDiscount(cart: ShoppingCart): DiscountInterface;
  applies(cart: ShoppingCart): boolean;
}

export default OfferInterface;