import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";

export class FakeBookingRepository implements BookingRepository {
    private bookings: Booking[] = [];

    async save(booking: Booking): Promise<void> {
        this.bookings.push(booking);
    }

    async findBookingById(id: string): Promise<Booking | null> {
        return this.bookings.find(booking => booking.getId() === id) || null;
    }
}