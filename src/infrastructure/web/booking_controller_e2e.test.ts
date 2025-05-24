import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";       
import { TypeORMBookingRepository } from "../repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/user_entity";
import { BookingController } from "./booking_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        entities: [
            BookingEntity,
            PropertyEntity,
            UserEntity
        ],
        logging: false,
    });
    
    await dataSource.initialize();
    
    bookingRepository = new TypeORMBookingRepository(
        dataSource.getRepository(BookingEntity)
    );

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );
    
    propertyService = new PropertyService(propertyRepository);
    userService = new UserService(userRepository);
    bookingService = new BookingService(
        bookingRepository,
        propertyService,
        userService
    );

    bookingController = new BookingController(bookingService);

    app.post("/bookings", (req, res, next) => {
        bookingController.createBooking(req, res).catch((err: any) => next(err));
    });

    app.post("/bookings/:id/cancel", (req, res, next) => {
        bookingController.cancelBooking(req, res).catch((err: any) => next(err));
    });
    
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("BookingController", () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await bookingRepo.clear();
        await propertyRepo.clear();
        await userRepo.clear();

        await propertyRepo.save({
            id: "1",
            name: "Casa na montanha",
            description: "Uma casa aconchegante na montanha",
            maxGuests: 4,
            basePricePerNight: 100
        });

        await userRepo.save({
            id: "1",
            name: "João"
        });
    });

    it("deve criar uma reserva com sucesso", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "1",
            guestId: "1",
            startDate: "2025-02-01",
            endDate: "2025-02-10",
            guestCount: 2
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Reserva criada com sucesso");
        expect(response.body.booking).toHaveProperty("id");
        expect(response.body.booking).toHaveProperty("totalPrice");
    });

    it("deve retornar 400 ao tentar criar uma reserva com data de início inválida", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "1",
            guestId: "1",
            startDate: "invalide-date",
            endDate: "2025-02-10",
            guestCount: 2
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Data de início ou fim inválida");
    });

    it("deve retornar 400 ao tentar criar uma reserva com data de fim inválida", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "1",
            guestId: "1",
            startDate: "2025-02-01",
            endDate: "invalide-date",
            guestCount: 2
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Data de início ou fim inválida");
    });

    it("deve retornar 400 ao tentar criar uma reserva com número de hóspedes inválido", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "1",
            guestId: "1",
            startDate: "2025-02-01",
            endDate: "2025-02-10",
            guestCount: 0
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O número de hóspedes deve ser maior que zero.");
    });

    it("deve retornar 400 ao tentar criar uma reserva com propertyId inválido", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "invalid-id",
            guestId: "1",
            startDate: "2025-02-01",
            endDate: "2025-02-10",
            guestCount: 2
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Propriedade não encontrada");
    });


    it("deve cancelar uma reserva", async () => {
        const response = await request(app).post("/bookings").send({
            propertyId: "1",
            guestId: "1",
            startDate: "2025-02-01",
            endDate: "2025-02-10",
            guestCount: 2
        });

        const bookingId = response.body.booking.id;

        const cancelResponse = await request(app)
            .post(`/bookings/${bookingId}/cancel`);

        expect(cancelResponse.status).toBe(200);
        expect(cancelResponse.body.message).toBe("Reserva cancelada com sucesso");

    });

     it("deve retornar um erro ao cancelar uma reserva inexistente", async () => {
        const cancelResponse = await request(app).post(`/bookings/999/cancel`);

        expect(cancelResponse.status).toBe(400);
        expect(cancelResponse.body.message).toBe("Reserva não encontrada");

    });
    
});