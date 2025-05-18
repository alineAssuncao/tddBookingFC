import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { RefundRuleFactory } from "../cancelation/refund_rule_factory";
import { IDateRange } from "../interfaces/idate_range";

export class Booking{
    private readonly id: string;
    private readonly property: Property;    
    private readonly guest: User;
    private readonly dateRange: IDateRange;
    private readonly guestCount: number;
    private status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED';
    private totalPrice: number;

    constructor(
        id: string,
        property: Property,
        guest: User,
        dateRange: IDateRange,
        guestCount: number
    ){
        if(!id){
            throw new Error("Id não pode ser vazio");
        }

        if(guestCount <= 0){
            throw new Error("O número de hóspedes deve ser maior que zero.");
        }

        property.validateGuestCount(guestCount);

        if(!property.isAvailable(dateRange)){
            throw new Error("A propriedade não está disponível para as datas selecionadas.");   
        }

        this.id = id;
        this.property = property;
        this.guest = guest;
        this.dateRange = dateRange;
        this.guestCount = guestCount;
        this.totalPrice = property.calculateTotalPrice(dateRange);
        this.status = 'CONFIRMED';

        property.addBooking(this);
    }

    getId(): string{
        return this.id;
    }  

    getProperty(): Property{
        return this.property;
    }

    getUser(): User{
        return this.guest;
    }

    getDateRange(): IDateRange{
        return this.dateRange;
    }

    getGuestCount(): number{
        return this.guestCount;
    }

    getStatus(): 'CONFIRMED' | 'CANCELLED'{
        return this.status;
    }

    getTotalPrice(): number{
        return this.totalPrice;
    }

    cancel(currentDate: Date): void{
        if(this.status === 'CANCELLED'){
            throw new Error("Reserva já foi cancelada.");
        }
        this.status = 'CANCELLED';

        const checkInDate = this.dateRange.getStartDate();
        const timeDifference = checkInDate.getTime() - currentDate.getTime();
        const daysUntilCheckin = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckin);
        this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    }

}