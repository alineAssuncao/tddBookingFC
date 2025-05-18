//dto (data transfer object) for creating a booking
export interface CreateBookingDTO {
    startDate: Date;
    endDate: Date;
    propertyId: string; 
    guestId: string;
    guestCount: number;
}