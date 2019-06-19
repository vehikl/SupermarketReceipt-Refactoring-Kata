import { FakeCatalog } from "./FakeCatalog"
import { Product } from "../src/model/Product"
import { SupermarketCatalog } from "../src/model/SupermarketCatalog"
import { Receipt } from "../src/model/Receipt"
import { ShoppingCart } from "../src/model/ShoppingCart"
import { Teller } from "../src/model/Teller"
import { SpecialOfferType } from "../src/model/SpecialOfferType"
import { ProductUnit } from "../src/model/ProductUnit"

describe('Supermarket', function () {

    it('three for two discount', function () {
        const toothbrushPrice: number = 0.99;
        const catalog: SupermarketCatalog = new FakeCatalog();
        const toothbrush: Product = new Product("toothbrush", ProductUnit.Each);
        catalog.addProduct(toothbrush, toothbrushPrice);

        const cart: ShoppingCart = new ShoppingCart();
        cart.addItemQuantity(toothbrush, 3);

        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 10.0);

        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(toothbrushPrice * 2)
    });

});
