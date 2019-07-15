import { FakeCatalog } from "./FakeCatalog"
import { Product } from "../src/model/Product"
import { SupermarketCatalog } from "../src/model/SupermarketCatalog"
import { Receipt } from "../src/model/Receipt"
import { ShoppingCart } from "../src/model/ShoppingCart"
import { Teller } from "../src/model/Teller"
import { SpecialOfferType } from "../src/model/SpecialOfferType"
import { ProductUnit } from "../src/model/ProductUnit"
import { ReceiptPrinter } from "../src/ReceiptPrinter"
import { FiveForAmountOffer } from "../src/model/FiveForAmountOffer";
import OfferInterface from "../src/model/OfferInterface";
import { ThreeForTwoOffer } from "../src/model/ThreeForTwoOffer";
import { Offer } from "../src/model/Offer";
import { PercentageDiscountOffer } from "../src/model/PercentageDiscountOffer";
import { TwoForAmountOffer } from "../src/model/TwoForAmountOffer";

describe('Supermarket', () => {
    const applePrice: number = 1.99;
    const toothbrushPrice: number = 0.99;
    const ricePrice: number = 2.49;
    const toothpastePrice: number = 1.79;
    const cherryTomatoesPrice: number = 0.69;
    let toothbrush: Product;
    let toothpaste: Product;
    let apples: Product;
    let rice: Product;
    let cherryTomatoes: Product;
    let catalog: SupermarketCatalog;
    let cart: ShoppingCart;
    let teller: Teller;
    let receipt: Receipt;
    let printer: ReceiptPrinter;

    beforeEach(() => {
        catalog = new FakeCatalog();
        toothbrush = new Product("toothbrush", ProductUnit.Each);
        apples = new Product("apples", ProductUnit.Kilo);
        rice = new Product("rice", ProductUnit.Each);
        toothpaste = new Product("toothpaste", ProductUnit.Each);
        cherryTomatoes = new Product("cherry tomatoes", ProductUnit.Each);
        catalog.addProduct(toothbrush, toothbrushPrice);
        catalog.addProduct(apples, applePrice);
        catalog.addProduct(rice, ricePrice);
        catalog.addProduct(toothpaste, toothpastePrice);
        catalog.addProduct(cherryTomatoes, cherryTomatoesPrice);
        cart = new ShoppingCart();
        teller = new Teller(catalog);
        printer = new ReceiptPrinter();
    });

    it('applies three for two discount', () => {
        cart.addItemQuantity(toothbrush, 3);

        const threeForTwoOffer: OfferInterface = new ThreeForTwoOffer(toothbrush, toothbrushPrice);
        teller.addNewTypeOfSpecialOffer(threeForTwoOffer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(toothbrushPrice * 2);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('applies multiple offers', () => {
        const discountedPriceForTwo = 0.99;
        cart.addItemQuantity(toothbrush, 3);
        cart.addItemQuantity(cherryTomatoes, 3);

        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 10.0);
        teller.addSpecialOffer(SpecialOfferType.TwoForAmount, cherryTomatoes, discountedPriceForTwo);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(toothbrushPrice * 2 + discountedPriceForTwo + cherryTomatoesPrice);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('applies twenty percent discount', () => {
        const discountPercentage = 20.0;
        const discountMultiplier = (100 - discountPercentage) / 100;
        cart.addItemQuantity(apples, 1);

        const percentageOffer: OfferInterface = new PercentageDiscountOffer(apples, applePrice, discountPercentage);
        teller.addNewTypeOfSpecialOffer(percentageOffer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(applePrice * discountMultiplier);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('applies ten percent discount', () => {
        const discountPercentage = 10.0;
        const discountMultiplier = (100 - discountPercentage) / 100;
        cart.addItemQuantity(rice, 1);

        const percentageOffer: OfferInterface = new PercentageDiscountOffer(rice, ricePrice, discountPercentage);
        teller.addNewTypeOfSpecialOffer(percentageOffer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toBeCloseTo(ricePrice * discountMultiplier);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('applies five for amount discount', () => {
        const discountedPriceForFive: number = 7.49;
        cart.addItemQuantity(toothpaste, 5);

        const offer: OfferInterface = new FiveForAmountOffer(toothpaste, toothpastePrice, discountedPriceForFive);
        teller.addNewTypeOfSpecialOffer(offer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toEqual(discountedPriceForFive);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('applies two for amount discount', () => {
        const discountedPriceForTwo: number = 0.99;
        cart.addItem(cherryTomatoes);
        cart.addItem(cherryTomatoes);

        const offer: OfferInterface = new TwoForAmountOffer(cherryTomatoes, cherryTomatoesPrice, discountedPriceForTwo);
        teller.addNewTypeOfSpecialOffer(offer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toEqual(discountedPriceForTwo);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('does not apply two for amount if 1 item purchased', () => {
        const discountedPriceForTwo: number = 0.99;
        cart.addItem(cherryTomatoes);

        const offer: OfferInterface = new TwoForAmountOffer(cherryTomatoes, cherryTomatoesPrice, discountedPriceForTwo);
        teller.addNewTypeOfSpecialOffer(offer);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toEqual(cherryTomatoesPrice);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });

    it('does not apply discount to items not purchased', () => {
        cart.addItem(toothpaste);

        const offer: OfferInterface = new TwoForAmountOffer(cherryTomatoes, cherryTomatoesPrice, 0.99);
        teller.addNewTypeOfSpecialOffer(offer);
        // teller.addSpecialOffer(SpecialOfferType.TwoForAmount, cherryTomatoes, 0.99);

        receipt = teller.checksOutArticlesFrom(cart);

        expect(receipt.getTotalPrice()).toEqual(toothpastePrice);
        expect(printer.printReceipt(receipt)).toMatchSnapshot();
    });
});
