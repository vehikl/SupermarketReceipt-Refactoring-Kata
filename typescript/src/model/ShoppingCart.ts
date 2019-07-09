import { Product } from "./Product"
import { SupermarketCatalog } from "./SupermarketCatalog"
import * as _ from "lodash"
import { ProductQuantity } from "./ProductQuantity"
import { Discount } from "./Discount"
import { Receipt } from "./Receipt"
import { Offer } from "./Offer"
import { SpecialOfferType } from "./SpecialOfferType"
import { TwoForAmountOffer } from "./TwoForAmountOffer";
import { ThreeForTwoOffer } from "./ThreeForTwoOffer";

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

    getQuantityOf(product: Product): ProductQuantity {
        return this._productQuantities[product.name];
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

    handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog): void {
        for (const productName in this.productQuantities()) {
            const productQuantity = this._productQuantities[productName]
            const product = productQuantity.product;

            if (offers[productName]) {
                const offer: Offer = offers[productName];
                const unitPrice: number = catalog.getUnitPrice(product);

                const offerType = offer.offerType;

                let discount = this.getDiscountForOffer(productName, offerType, offer, unitPrice, product);

                if (discount != null)
                    receipt.addDiscount(discount);
            }

        }
    }

    private getDiscountForOffer(productName: string, offerType: SpecialOfferType, offer: Offer, unitPrice: number, product: Product) {
        const quantity: number = this._productQuantities[productName].quantity;
        const quantityAsInt = quantity;
        let minimumQuantityForOffer = this.getQuantityForOffer(offerType);
        const maybeDiscountMultiple = Math.floor(quantityAsInt / minimumQuantityForOffer);
        let discount: Discount | null = null;

        discount = this.getTwoForAmountDiscount(offerType, quantityAsInt, offer, minimumQuantityForOffer, unitPrice, quantity, discount, product);
        discount = this.threeForTwoDiscount(offerType, quantityAsInt, quantity, unitPrice, maybeDiscountMultiple, discount, product);
        discount = this.tenPercentDiscount(offerType, discount, product, offer, quantity, unitPrice);
        discount = this.fiveForAmountDiscount(offerType, quantityAsInt, unitPrice, quantity, offer, maybeDiscountMultiple, discount, product, minimumQuantityForOffer);
        return discount;
    }

    private fiveForAmountDiscount(offerType: SpecialOfferType, quantityAsInt: number, unitPrice: number, quantity: number, offer: Offer, maybeDiscountMultiple: number, discount: Discount | null, product: Product, minimumQuantityForOffer: number) {
        if (offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
            const discountAmount = unitPrice * quantity - (offer.argument * maybeDiscountMultiple + quantityAsInt % 5 * unitPrice);
            discount = new Discount(product, minimumQuantityForOffer + " for " + offer.argument, discountAmount);
        }
        return discount;
    }

    private tenPercentDiscount(offerType: SpecialOfferType, discount: Discount | null, product: Product, offer: Offer, quantity: number, unitPrice: number) {
        if (offerType == SpecialOfferType.TenPercentDiscount) {
            discount = new Discount(product, offer.argument + "% off", quantity * unitPrice * offer.argument / 100.0);
        }
        return discount;
    }

    private threeForTwoDiscount(offerType: SpecialOfferType, quantityAsInt: number, quantity: number, unitPrice: number, maybeDiscountMultiple: number, discount: Discount | null, product: Product) {
        const threeForTwo: ThreeForTwoOffer = new ThreeForTwoOffer(product, unitPrice);

        if (!threeForTwo.applies(this)) {
            return discount;
        }


        return threeForTwo.getDiscount(quantity);
    }

    private getTwoForAmountDiscount(offerType: SpecialOfferType, quantityAsInt: number, offer: Offer, minimumQuantityForOffer: number, unitPrice: number, quantity: number, discount: Discount | null, product: Product) {
        if (!(offerType == SpecialOfferType.TwoForAmount && quantityAsInt >= 2)) {
            return discount;
        }

        const twoForAmount: TwoForAmountOffer = new TwoForAmountOffer(product, unitPrice);
        return twoForAmount.getDiscount(quantityAsInt, offer, quantity);
    }

    private getQuantityForOffer(offerType: SpecialOfferType) {
        let minimumQuantityForOffer = 1;
        if (offerType == SpecialOfferType.ThreeForTwo) {
            minimumQuantityForOffer = 3;
        }
        else if (offerType == SpecialOfferType.TwoForAmount) {
            minimumQuantityForOffer = 2;
        }
        if (offerType == SpecialOfferType.FiveForAmount) {
            minimumQuantityForOffer = 5;
        }
        return minimumQuantityForOffer;
    }
}
