import { Product } from "./Product"
import * as _ from "lodash"
import { ProductQuantity } from "./ProductQuantity"
import OfferInterface from "./offers/OfferInterface";
import { Discount } from "./Discount";

type ProductQuantities = { [productName: string]: ProductQuantity }

export class ShoppingCart {

    private readonly items: ProductQuantity[] = [];
    _productQuantities: ProductQuantities = {};

    getItems(): ProductQuantity[] {
        return _.clone(this.items);
    }

    addItem(product: Product): void {
        this.addItemQuantity(product, 1.0);
    }

    getQuantityOf(product: Product): number {
        if (!this._productQuantities[product.name]) {
            return 0
        }
        return this._productQuantities[product.name].quantity;
    }

    public addItemQuantity(product: Product, quantity: number): void {
        let productQuantity = new ProductQuantity(product, quantity)
        this.items.push(productQuantity);
        let currentQuantity = this._productQuantities[product.name]
        if (currentQuantity) {
            this._productQuantities[product.name] = this.increaseQuantity(product, currentQuantity, quantity);
        } else {
            this._productQuantities[product.name] = productQuantity;
        }
    }

    private increaseQuantity(product: Product, productQuantity: ProductQuantity, quantity: number) {
        return new ProductQuantity(product, productQuantity.quantity + quantity)
    }

    getDiscounts(allSpecialOffers: Array<OfferInterface>): Array<Discount> {
        return allSpecialOffers.filter(offer => offer.applies(this))
            .map(offer => offer.getDiscount(this));
    }
}
