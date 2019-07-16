import {SupermarketCatalog} from "./SupermarketCatalog"
import {ShoppingCart} from "./ShoppingCart"
import {Receipt} from "./Receipt"
import OfferInterface from "./OfferInterface";

export class Teller {
    private offers: Array<OfferInterface> = [];

    public constructor(private readonly catalog: SupermarketCatalog ) {
    }

    public addSpecialOffer(offer: OfferInterface) {
        this.offers.push(offer);
    }

    public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
        const receipt = new Receipt();
        const productQuantities = theCart.getItems();
        for (let pq of productQuantities) {
            let p = pq.product;
            let quantity = pq.quantity;
            let unitPrice = this.catalog.getUnitPrice(p);
            let price = quantity * unitPrice;
            receipt.addProduct(p, quantity, unitPrice, price);
        }
        theCart.handleOffers(receipt, this.offers);

        return receipt;
    }

}
