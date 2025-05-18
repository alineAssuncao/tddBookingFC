import { Booking } from "../entities/booking";

export interface BookingRepository {
    save(booking: Booking): Promise<any>;
    findBookingById(id: string): Promise<Booking | null>;
}