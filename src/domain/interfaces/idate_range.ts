export interface IDateRange {
    validateDates(startDate: Date, endDate: Date): void;
    getStartDate(): Date;
    getEndDate(): Date;
    getTotalNights(): number;
    overlaps(other: IDateRange): boolean;
}
