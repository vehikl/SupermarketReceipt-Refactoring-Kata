import {SupermarketCatalog} from "./SupermarketCatalog"
import {ShoppingCart} from "./ShoppingCart"
import {Receipt} from "./Receipt"
import OfferInterface from "./offers/OfferInterface";
import { Discount } from "./Discount";
import { ReceiptItem } from "./ReceiptItem";
import DiscountInterface from "./DiscountInterface";

export class Teller {
    private offers: Array<OfferInterface> = [];

    public constructor(private readonly catalog: SupermarketCatalog ) {
    }

    public addSpecialOffer(offer: OfferInterface) {
        this.offers.push(offer);
    }

    public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
        const items = theCart.getItems().map(item => {
            let product = item.product;
            let quantity = item.quantity;
            let price = this.catalog.getUnitPrice(product);
            let totalPrice = quantity * price;
            return new ReceiptItem(product, quantity, price, totalPrice);
        });
        const discounts: Array<DiscountInterface> = this.getDiscounts(theCart);

        return new Receipt(items, discounts);
    }

    private getDiscounts(cart: ShoppingCart): Array<DiscountInterface> {
        return this.offers.filter(offer => offer.applies(cart))
            .map(offer => offer.getDiscount(cart));
    }
}
