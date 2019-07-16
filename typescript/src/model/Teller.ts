import {SupermarketCatalog} from "./SupermarketCatalog"
import {ShoppingCart} from "./ShoppingCart"
import {Receipt} from "./Receipt"
import OfferInterface from "./OfferInterface";
import { Discount } from "./Discount";
import { ReceiptItem } from "./ReceiptItem";

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
        const discounts: Array<Discount> = theCart.getDiscounts(this.offers);

        return new Receipt(items, discounts);
    }
}
