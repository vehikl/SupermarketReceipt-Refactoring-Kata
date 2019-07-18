import OfferInterface from './OfferInterface';
import { ShoppingCart } from '../ShoppingCart';
import { Discount } from '../Discount';
import { Product } from '../Product';
import { ProductUnit } from '../ProductUnit';
import { SupermarketCatalog } from '../SupermarketCatalog';

export class TenPercentBundledOffer implements OfferInterface {
  private bundledProducts: Array<Product>;
  private catalog: SupermarketCatalog;
  constructor(bundledProducts: Array<Product>, catalog: SupermarketCatalog) {
    this.bundledProducts = bundledProducts;
    this.catalog = catalog;
  }

  getDiscount(cart: ShoppingCart): Discount {
    const bundleCount = this.getBundleCount(cart);
    let totalPrice: number = this.getTotalPriceOfBundledProducts(bundleCount);
    return new Discount(new Product('product', ProductUnit.Kilo), '', totalPrice * 0.1);
  }

  private getTotalPriceOfBundledProducts(bundleCount: number) {
    let totalPrice: number = 0;
    this.bundledProducts.forEach(product => {
      totalPrice += this.catalog.getUnitPrice(product);
    });

    return totalPrice * bundleCount;
  }

  private getBundleCount(cart: ShoppingCart) {
    return this.bundledProducts
      .map(product => cart.getQuantityOf(product))
      .reduce((result, quantity) => Math.min(result, quantity));
  }

  applies(cart: ShoppingCart): boolean {
    return this.bundledProducts.every(product => {
      return cart.getQuantityOf(product) >= 1;
    });
  }
}
