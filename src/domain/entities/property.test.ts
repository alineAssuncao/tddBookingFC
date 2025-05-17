import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

describe("Property Entity", () => {
    it("deve criar uma instancia de Property com todo os atritutos", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Casa de campo");
        expect(property.getDescription()).toBe("Casa tranquila, junto a natureza");
        expect(property.geMaxGuests()).toBe(4);
        expect(property.getBasePrice()).toBe(175);
    });

    it("deve lançar um erro se o id for vazio", () => { 
        expect(() => {
            new Property("", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        }).toThrow("Id não pode ser vazio");   
    });

    it("deve lançar um erro se o nome for vazio", () => { 
        expect(() => {
            new Property("1", "", "Casa tranquila, junto a natureza", 4, 175);
        }).toThrow("O nome é obrigatório.");   
    });

    it("deve lançar um erro se o numero de hospedes for zero ou negatigo", () => {
        expect(() => {
            new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 0, 175);
        }).toThrow("O número máximo de hóspedes deve ser maior que zero.");

        expect(() => {
            new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", -1, 175);
        }).toThrow("O número máximo de hóspedes deve ser maior que zero."); 
    });

    it("deve validar o número máximo de hóspedes", () => {  
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 5, 175);
        expect(() => {
            property.validateGuestCount(6);
        }).toThrow("O número máximo de hóspedes excedido. Máximo permitido: 5.");
    });

    it("não deve aplicar desconto para estadias menores que 7 noites", () => { 
        const property = new Property("2", "Casa de praia", "Casa linda", 2, 200);
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(800); 
    });

    it("deve aplicar desconto para estadias iguais ou maiores que 7 noites", () => { 
        const property = new Property("2", "Casa de praia", "Casa linda", 2, 200);
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-08"));
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(1260);
    });

    it("deve verificar disponibilidade da propriedade", () => {
        const property = new Property("2", "Casa de praia", "Casa linda", 2, 200);
        const user = new User("1", "Aline Assunção");
        const dateRangeReserva = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));
        const dateRangeNovaReserva = new DateRange(new Date("2023-10-03"), new Date("2023-10-10"));

        new Booking("1", property, user, dateRangeReserva, 2);

        expect(property.isAvailable(dateRangeReserva)).toBe(false);
        expect(property.isAvailable(dateRangeNovaReserva)).toBe(false);
    });

    it("deve adicionar um booking à lista de reservas", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));

        const booking = new Booking("1", property, user, dateRange, 2);

        expect(property.getBookings()).toContain(booking);
    });

    it("deve retornar todas as reservas da propriedade", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange1 = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));
        const dateRange2 = new DateRange(new Date("2023-10-06"), new Date("2023-10-10"));

        const booking1 = new Booking("1", property, user, dateRange1, 2);
        const booking2 = new Booking("2", property, user, dateRange2, 2);

        expect(property.getBookings()).toEqual([booking1, booking2]);
    }); 
});