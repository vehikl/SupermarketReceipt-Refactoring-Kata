import {Product} from "./Product"

export class Discount {

    constructor(private readonly product: Product,
                public readonly description: string,
                public readonly discountAmount: number) {
    }

    getProductPresentation(): string {
        return this.product.name;
    }
}
