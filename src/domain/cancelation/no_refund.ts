import { RefundRule } from './refund_rule.interface';

export class NoRefund implements RefundRule {
    calculateRefund(totalPrice: number): number {
        return totalPrice;
    }

}
