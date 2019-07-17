import OfferInterface from './OfferInterface';
import { ShoppingCart } from '../ShoppingCart';
import { Discount } from '../Discount';
import { Product } from '../Product';
import { ProductUnit } from '../ProductUnit';
import { SupermarketCatalog } from '../SupermarketCatalog';

export class TenPercentBundledOffer implements OfferInterface {
  private products: Array<Product>;
  private catalog: SupermarketCatalog;
  constructor(products: Array<Product>, catalog: SupermarketCatalog) {
    this.products = products;
    this.catalog = catalog;
  }

  getDiscount(cart: ShoppingCart): Discount {
    let totalPrice: number = 0;
    this.products.forEach(product => {
      totalPrice += this.catalog.getUnitPrice(product);
    });
    return new Discount(new Product('product', ProductUnit.Kilo), '', totalPrice * 0.1);
  }

  applies(cart: ShoppingCart): boolean {
    return true;
  }
}
