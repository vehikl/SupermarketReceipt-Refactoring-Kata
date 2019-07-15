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

    getQuantityOfNumber(product: Product): number {
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

    handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog, allSpecialOffers: Array<OfferInterface>): void {

        if (allSpecialOffers && allSpecialOffers.length) {
            return this.calcDiscountUsingNewStructure(allSpecialOffers, receipt);
        }

        this.calcDiscountUsingTheOldWay(offers, catalog, receipt);
    }

    private calcDiscountUsingTheOldWay(offers: OffersByProduct, catalog: SupermarketCatalog, receipt: Receipt) {
        for (const productName in this.productQuantities()) {
            const productQuantity = this._productQuantities[productName];
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

    private calcDiscountUsingNewStructure(allSpecialOffers: OfferInterface[], receipt: Receipt) {
        allSpecialOffers.forEach(offer => {
            if (offer.applies(this)) {
                receipt.addDiscount(offer.getDiscount(this));
            }
        });
        return;
    }

    private getDiscountForOffer(productName: string, offerType: SpecialOfferType, offer: Offer, unitPrice: number, product: Product) {
        const quantity: number = this._productQuantities[productName].quantity;

        let discount: Discount | null = null;

        discount = this.getTwoForAmountDiscount(offerType, offer, unitPrice, discount, product);
        discount = this.threeForTwoDiscount(offerType, unitPrice, discount, product);
        discount = this.percentageDiscount(offerType, discount, product, offer, unitPrice);
        discount = this.fiveForAmountDiscount(offerType, unitPrice, offer, discount, product);
        return discount;
    }

    private fiveForAmountDiscount(offerType: SpecialOfferType, unitPrice: number, offer: Offer, discount: Discount | null, product: Product) {
        const fiveForAmount: FiveForAmountOffer = new FiveForAmountOffer(product, unitPrice, offer.argument);

        if (offerType == SpecialOfferType.FiveForAmount && fiveForAmount.applies(this)) {
            return fiveForAmount.getDiscount(this);
        }
        return discount;
    }

    private percentageDiscount(offerType: SpecialOfferType, discount: Discount | null, product: Product, offer: Offer, unitPrice: number) {
        const percentageDiscount: PercentageDiscountOffer = new PercentageDiscountOffer(product, unitPrice, offer.argument);
        if (offerType == SpecialOfferType.TenPercentDiscount && percentageDiscount.applies(this)) {
            return percentageDiscount.getDiscount(this);
        }
        return discount;
    }

    private threeForTwoDiscount(offerType: SpecialOfferType, unitPrice: number, discount: Discount | null, product: Product) {
        const threeForTwo: ThreeForTwoOffer = new ThreeForTwoOffer(product, unitPrice);

        if (offerType == SpecialOfferType.ThreeForTwo && threeForTwo.applies(this)) {
            return threeForTwo.getDiscount(this);
        }
        return discount;
    }

    private getTwoForAmountDiscount(offerType: SpecialOfferType, offer: Offer, unitPrice: number, discount: Discount | null, product: Product) {
        const twoForAmount: TwoForAmountOffer = new TwoForAmountOffer(product, unitPrice, offer.argument);

        if (offerType == SpecialOfferType.TwoForAmount && twoForAmount.applies(this)) {
            return twoForAmount.getDiscount(this);
        }
        return discount;
    }
}
