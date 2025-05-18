import { IDateRange } from "../interfaces/idate_range";

export class DateRange implements IDateRange {
    private readonly startDate: Date;
    private readonly endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.validateDates(startDate, endDate);
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public validateDates(startDate: Date, endDate: Date): void{
        if (startDate === endDate){
            throw new Error("A data de início e término não podem ser iguais.");
        }
        if (endDate < startDate){
            throw new Error("A data de término deve ser posterior à data de início.");
        }
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getTotalNights(): number{
        const diffTime = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(diffTime / (1000 * 3600 * 24));
    }

    overlaps(other: IDateRange): boolean{
        return(
            this.startDate < other.getEndDate() && other.getStartDate() < this.endDate
        )
    }
}