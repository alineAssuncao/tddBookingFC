import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRule } from "./refund_rule.interface";

export class RefundRuleFactory {
    static getRefundRule(daysUntilCheckin: number): RefundRule {
        if (daysUntilCheckin > 7) {       
            return new FullRefund();
        } 
        else if (daysUntilCheckin >= 1) {
            return new PartialRefund();
        }
        return new NoRefund();        
    }   
    
}