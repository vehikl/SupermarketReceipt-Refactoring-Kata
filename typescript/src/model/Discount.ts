import { Product } from "./Product"
import DiscountInterface from "./DiscountInterface"

export class Discount implements DiscountInterface {

    constructor(private readonly product: Product,
                private readonly description: string,
                private readonly discountAmount: number) {
    }

    getProductPresentation(): string {
        return this.product.name;
    }

    getDescription(): string {
        return this.description;
    }

    getDiscountAmount(): number {
        return this.discountAmount;
    }
}
