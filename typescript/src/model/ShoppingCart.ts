import { Product } from "./Product"
import { SupermarketCatalog } from "./SupermarketCatalog"
import * as _ from "lodash"
import { ProductQuantity } from "./ProductQuantity"
import { Receipt } from "./Receipt"
import { Offer } from "./Offer"
import OfferInterface from "./OfferInterface";

type ProductQuantities = { [productName: string]: ProductQuantity }
export type OffersByProduct = { [productName: string]: Offer };

export class ShoppingCart {

    private readonly items: ProductQuantity[] = [];
    _productQuantities: ProductQuantities = {};


    getItems(): ProductQuantity[] {
        return _.clone(this.items);
    }

    addItem(product: Product): void {
        this.addItemQuantity(product, 1.0);
    }

    productQuantities(): ProductQuantities {
        return this._productQuantities;
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

    handleOffers(receipt: Receipt, allSpecialOffers: Array<OfferInterface>): void {
        allSpecialOffers.forEach(offer => {
            if (offer.applies(this)) {
                receipt.addDiscount(offer.getDiscount(this));
            }
        });
    }
}
