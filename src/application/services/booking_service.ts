import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { DateRange } from "../../domain/value_objects/date_range";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { IDateRange } from "../../domain/interfaces/idate_range";
import { v4 as uuidv4 } from "uuid";

export class BookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly propertyService: PropertyService,
        private readonly userService: UserService
    ) {}
    
    async createBooking(dto: CreateBookingDTO, dateRange: IDateRange): Promise<Booking> {
        const property = await this.propertyService.findPropertyById(
            dto.propertyId
        );
        if (!property) {
            throw new Error("Propriedade não encontrada");
        }

        const user = await this.userService.findUserById(dto.guestId);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        //const dataRangeInstance = new DateRange(dto.startDate, dto.endDate); //desacoplar usando mock

        const booking = new Booking(
            uuidv4(),
            property,
            user,
            dateRange,
            dto.guestCount
        );

        await this.bookingRepository.save(booking);
        return booking;

    }
}
