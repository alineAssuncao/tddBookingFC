import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";
import { Booking } from "../../domain/entities/booking";
import { BookingService } from "../../application/services/booking_service";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";  
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { DateRange } from "../../domain/value_objects/date_range";
import { IDateRange } from "../../domain/interfaces/idate_range";

jest.mock("./property_service");
jest.mock("./user_service");

describe('BookingService', () => {

    let bookingService: BookingService;
    let fakeBookingRepository: FakeBookingRepository;
    let mockPropertyService: jest.Mocked<PropertyService>;
    let mockUserService: jest.Mocked<UserService>;

    beforeEach(() => {
        const mockPropertyRepository = {} as any;
        const mockUserRepository = {} as any;
        const mockDateRange = { startDate: new Date("2025-06-01"), endDate: new Date("2025-06-10") };

        mockPropertyService = new PropertyService(
            mockPropertyRepository
        ) as jest.Mocked<PropertyService>;

        mockUserService = new UserService(
            mockUserRepository
        ) as jest.Mocked<UserService>;

        fakeBookingRepository = new FakeBookingRepository();

        bookingService = new BookingService(
            fakeBookingRepository,
            mockPropertyService,
            mockUserService
        );

    });

    it("deve criar uma reserva com sucesso usando repositorio fake", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(1000),
            addBooking: jest.fn(),
            dateRange: jest.fn().mockReturnValue({
                startDate: new Date("2025-10-01"),  
                endDate: new Date("2025-10-05"),
            }),
        } as any;

        const mockDateRange: IDateRange = {
            validateDates: () => true,
            getStartDate: () => new Date("2025-06-01"),
            getEndDate: () => new Date("2025-06-10"),
            getTotalNights: () => 9,
            overlaps: () => false
        } as any;


        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);
        
        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            guestCount: 2,
        };
        const result = await bookingService.createBooking(bookingDTO, mockDateRange);

        expect(result).toBeInstanceOf(Booking);
        expect(result.getStatus()).toBe("CONFIRMED");
        expect(result.getTotalPrice()).toBe(1000); 

        const savedBooking = await fakeBookingRepository.findBookingById(result.getId());
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(result.getId());
    });

    it("deve lançar um erro quando a propriedade não for encontrada", async () => {
        mockPropertyService.findPropertyById.mockResolvedValue(null);        
        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            guestCount: 2,
        };
        await expect(bookingService.createBooking(bookingDTO, {} as IDateRange)).rejects.toThrow("Propriedade não encontrada");
    });

    it("deve lançar um erro quando a usuário não for encontrada", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"), 
        } as any;
        
        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);   
        mockUserService.findUserById.mockResolvedValue(null);    
        
        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            guestCount: 2,
        };
        await expect(bookingService.createBooking(bookingDTO, {} as IDateRange)).rejects.toThrow("Usuário não encontrado");
    });

    it("deve lançar um erro ao tentar criar reserva para um periodo reservado", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(1000),
            addBooking: jest.fn(),
            dateRange: jest.fn().mockReturnValue({
                startDate: new Date("2025-10-01"),  
                endDate: new Date("2025-10-05"),
            }),
        } as any;

        const mockDateRange: IDateRange = {
            validateDates: () => true,
            getStartDate: () => new Date("2025-06-01"),
            getEndDate: () => new Date("2025-06-10"),
            getTotalNights: () => 9,
            overlaps: () => false
        } as any;


        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);
        
        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            guestCount: 2,
        };
        const result = await bookingService.createBooking(bookingDTO, mockDateRange);

        mockProperty.isAvailable.mockReturnValue(false);
        mockProperty.addBooking.mockImplementationOnce(() => {
            throw new Error("A propriedade não está disponível para as datas selecionadas.");
        });

        await expect(bookingService.createBooking(bookingDTO, mockDateRange)).rejects.toThrow("A propriedade não está disponível para as datas selecionadas.");
    });

    it("deve cancelar uma reserva existente usando o repositório fake", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(1000),
            addBooking: jest.fn(),
            dateRange: jest.fn().mockReturnValue({
                startDate: new Date("2025-10-01"),  
                endDate: new Date("2025-10-05"),
            }),
        } as any;

        const mockDateRange: IDateRange = {
            validateDates: () => true,
            getStartDate: () => new Date("2025-06-01"),
            getEndDate: () => new Date("2025-06-10"),
            getTotalNights: () => 9,
            overlaps: () => false
        } as any;


        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);
        
        const bookingDTO: CreateBookingDTO = {
            propertyId: "1",
            guestId: "1",
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            guestCount: 2,
        };
        const booking = await bookingService.createBooking(bookingDTO, mockDateRange);

        const spyFindBookingById = jest.spyOn(fakeBookingRepository, "findBookingById");

        await bookingService.cancelBooking(booking.getId());
        const canceledBooking = await fakeBookingRepository.findBookingById(booking.getId());

        expect(canceledBooking).not.toBeNull(); 
        expect(canceledBooking?.getStatus()).toBe("CANCELLED");
        expect(spyFindBookingById).toHaveBeenCalledWith(booking.getId());
        expect(spyFindBookingById).toHaveBeenCalledTimes(2);
        spyFindBookingById.mockRestore();
    });
});