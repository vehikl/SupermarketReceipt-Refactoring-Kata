import { FakeCatalog } from "./FakeCatalog"
import { Product } from "../src/model/Product"
import { SupermarketCatalog } from "../src/model/SupermarketCatalog"
import { Receipt } from "../src/model/Receipt"
import { ShoppingCart } from "../src/model/ShoppingCart"
import { Teller } from "../src/model/Teller"
import { SpecialOfferType } from "../src/model/SpecialOfferType"
import { ProductUnit } from "../src/model/ProductUnit"

describe('Supermarket', function () {
    const applePrice: number = 1.99;
    const toothbrushPrice: number = 0.99;
    let toothbrush: Product;
    let apples: Product;
    let catalog: SupermarketCatalog;

    beforeEach(() => {
        catalog = new FakeCatalog();
        toothbrush = new Product("toothbrush", ProductUnit.Each);
        apples = new Product("apples", ProductUnit.Kilo);
        catalog.addProduct(toothbrush, toothbrushPrice);
        catalog.addProduct(apples, applePrice);
    });

    it('three for two discount', function () {
        const cart: ShoppingCart = new ShoppingCart();
        cart.addItemQuantity(toothbrush, 3);

        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 10.0);

        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(toothbrushPrice * 2);
    });

    it('applies percentage discounts', () => {
        const cart: ShoppingCart = new ShoppingCart();
        cart.addItemQuantity(apples, 1);

        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apples, 20.0);

        const receipt: Receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt).toMatchSnapshot();
        expect(receipt.getTotalPrice()).toBeCloseTo(applePrice * 0.8);
    });
});
