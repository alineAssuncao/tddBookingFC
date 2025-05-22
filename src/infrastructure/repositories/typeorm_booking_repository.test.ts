import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { User } from "../../domain/entities/user";
import { Property } from "../../domain/entities/property";
import { DateRange } from "../../domain/value_objects/date_range";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { Booking } from "../../domain/entities/booking";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";

describe("TypeORMBookingRepository", () => {

    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity, PropertyEntity, BookingEntity],
            synchronize: true,
            logging: false,
        });

        await dataSource.initialize();
        bookingRepository = new TypeORMBookingRepository(
            dataSource.getRepository(BookingEntity)
        );
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma reserva com sucesso", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            name: "Casa",
            description: "Rua movimentada",
            maxGuests: 6,   
            basePricePerNight: 100
        });
        propertyEntity.id = "1";
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1",
            "Casa",
            "Rua movimentada",
            6,
            100
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "John Doe",
        });
        await userRepository.save(userEntity);

        const user = new User("1", "John Doe");
        const dataRange = new DateRange(
            new Date("2023-10-01"),
            new Date("2023-10-10")
        );

        const booking = new Booking("1", property, user, dataRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findBookingById("1");
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe("1");
        expect(savedBooking?.getProperty().getId()).toBe("1");
        expect(savedBooking?.getGuest().getId()).toBe("1");
    });

    it("deve retornar null quando ID for inexistente", async () => {
        const booking = await bookingRepository.findBookingById("999");
        expect(booking).toBeNull();
    });

    it("deve salvar uma reserva com sucesso, fazendo um cancelamento posterior", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            name: "Casa",
            description: "Rua movimentada",
            maxGuests: 6,   
            basePricePerNight: 100
        });
        propertyEntity.id = "1";
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1",
            "Casa",
            "Rua movimentada",
            6,
            100
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "John Doe",
        });
        await userRepository.save(userEntity);

        const user = new User("1", "John Doe");
        const dataRange = new DateRange(
            new Date("2023-10-01"),
            new Date("2023-10-10")
        );

        const booking = new Booking("1", property, user, dataRange, 4);
        await bookingRepository.save(booking);

        booking.cancel(new Date("2023-09-20"));
        await bookingRepository.save(booking);

        const updateBooking = await bookingRepository.findBookingById("1");
        expect(updateBooking).not.toBeNull();
        expect(updateBooking?.getStatus()).toBe("CANCELLED");
    });

});