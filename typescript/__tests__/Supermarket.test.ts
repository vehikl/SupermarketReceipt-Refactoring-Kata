import { FakeCatalog } from "./FakeCatalog"
import { Product } from "../src/model/Product"
import { SupermarketCatalog } from "../src/model/SupermarketCatalog"
import { Receipt } from "../src/model/Receipt"
import { ShoppingCart } from "../src/model/ShoppingCart"
import { Teller } from "../src/model/Teller"
import { SpecialOfferType } from "../src/model/SpecialOfferType"
import { ProductUnit } from "../src/model/ProductUnit"

describe('Supermarket', () => {
    const applePrice: number = 1.99;
    const toothbrushPrice: number = 0.99;
    const ricePrice: number = 2.49;
    let toothbrush: Product;
    let apples: Product;
    let rice: Product;
    let catalog: SupermarketCatalog;
    let cart: ShoppingCart;
    let teller: Teller;
    let receipt: Receipt;

    beforeEach(() => {
        catalog = new FakeCatalog();
        toothbrush = new Product("toothbrush", ProductUnit.Each);
        apples = new Product("apples", ProductUnit.Kilo);
        rice = new Product("rice", ProductUnit.Each);
        catalog.addProduct(toothbrush, toothbrushPrice);
        catalog.addProduct(apples, applePrice);
        catalog.addProduct(rice, ricePrice);
        cart = new ShoppingCart();
        teller = new Teller(catalog);
    });

    afterEach(() => {
        expect(receipt).toMatchSnapshot();
    })

    it('applies three for two discount', () => {
        cart.addItemQuantity(toothbrush, 3);

        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 10.0);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(toothbrushPrice * 2);
    });

    it('applies twenty percent discount', () => {
        const discountPercentage = 20.0;
        const discountMultiplier = (100 - discountPercentage) / 100;
        cart.addItemQuantity(apples, 1);

        teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apples, discountPercentage);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(applePrice * discountMultiplier);
    });

    it('applies ten percent discount', () => {
        const discountPercentage = 10.0;
        const discountMultiplier = (100 - discountPercentage) / 100;
        cart.addItemQuantity(rice, 1);

        teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, rice, discountPercentage);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(ricePrice * discountMultiplier);
    });
});
