import {Discount} from "./Discount"
import {ReceiptItem} from "./ReceiptItem"

export class Receipt {
    private readonly items: ReceiptItem[] = [];
    private readonly discounts: Discount[] = [];

    public constructor(items: Array<ReceiptItem>, discounts: Array<Discount>) {
        this.items = items;
        this.discounts = discounts;
    }

    public getTotalPrice(): number {
        let total = 0.0;
        for (let item of this.items) {
            total += item.totalPrice;
        }
        for (let discount of this.discounts) {
            total -= discount.getDiscountAmount();
        }
        return total;
    }

    public getItems(): ReceiptItem[] {
        return this.items;
    }

    public getDiscounts(): Discount[] {
        return this.discounts;
    }
}
