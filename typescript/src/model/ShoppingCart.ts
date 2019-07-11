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
import { PercentageDiscountOffer } from "./PercentageDiscountOffer";
import { FiveForAmountOffer } from "./FiveForAmountOffer";

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

        let discount: Discount | null = null;

        discount = this.getTwoForAmountDiscount(offerType, offer, unitPrice, quantity, discount, product);
        discount = this.threeForTwoDiscount(offerType, quantity, unitPrice, discount, product);
        discount = this.percentageDiscount(offerType, discount, product, offer, quantity, unitPrice);
        discount = this.fiveForAmountDiscount(offerType, unitPrice, quantity, offer, discount, product);
        return discount;
    }

    private fiveForAmountDiscount(offerType: SpecialOfferType, unitPrice: number, quantity: number, offer: Offer, discount: Discount | null, product: Product) {
        const fiveForAmount: FiveForAmountOffer = new FiveForAmountOffer(product, unitPrice, offer.argument);

        if (offerType == SpecialOfferType.FiveForAmount && fiveForAmount.applies(this)) {
            return fiveForAmount.getDiscount(quantity);
        }
        return discount;
    }

    private percentageDiscount(offerType: SpecialOfferType, discount: Discount | null, product: Product, offer: Offer, quantity: number, unitPrice: number) {
        const percentageDiscount: PercentageDiscountOffer = new PercentageDiscountOffer(product, unitPrice, offer.argument);
        if (offerType == SpecialOfferType.TenPercentDiscount && percentageDiscount.applies(this)) {
            return percentageDiscount.getDiscount(quantity);
        }
        return discount;
    }

    private threeForTwoDiscount(offerType: SpecialOfferType, quantity: number, unitPrice: number, discount: Discount | null, product: Product) {
        const threeForTwo: ThreeForTwoOffer = new ThreeForTwoOffer(product, unitPrice);

        if (offerType == SpecialOfferType.ThreeForTwo && threeForTwo.applies(this)) {
            return threeForTwo.getDiscount(quantity);
        }
        return discount;
    }

    private getTwoForAmountDiscount(offerType: SpecialOfferType, offer: Offer, unitPrice: number, quantity: number, discount: Discount | null, product: Product) {
        const twoForAmount: TwoForAmountOffer = new TwoForAmountOffer(product, unitPrice, offer.argument);

        if (offerType == SpecialOfferType.TwoForAmount && twoForAmount.applies(this)) {
            return twoForAmount.getDiscount(quantity);
        }
        return discount;
    }
}
