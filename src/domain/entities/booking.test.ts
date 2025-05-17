import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";

describe("Booking Entity", () => {
    it("deve criar uma instância de Booking com todos os atributos", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));

        const booking = new Booking("1", property, user, dateRange, 2);

        expect(booking.getId()).toBe("1");
        expect(booking.getProperty()).toBe(property);
        expect(booking.getUser()).toBe(user);
        expect(booking.getDateRange()).toBe(dateRange);
        expect(booking.getGuestCount()).toBe(2);
    });

    it("deve lançar um erro se o id for vazio", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));

        expect(() => new Booking("", property, user, dateRange, 2)).toThrow("Id não pode ser vazio")
    });

    it("deve lançar um erro se o numero de hospedes for zero ou negatigo", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));

        expect(() => new Booking("2", property, user, dateRange, 0)).toThrow("O número de hóspedes deve ser maior que zero.");

        expect(() => new Booking("3", property, user, dateRange, -2)).toThrow("O número de hóspedes deve ser maior que zero."); 
    });

    it("deve lançar um erro ao tentar reservar com número de hóspedes acima do máximo permitido", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-05"));

        expect(() => new Booking("2", property, user, dateRange, 5)).toThrow("O número máximo de hóspedes excedido. Máximo permitido: 4.");
    });

    it("deve calcular o preço total com desconto", () => {
        // Arrange
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-15"));

        // Act
        const booking = new Booking("1", property, user, dateRange, 4);

        // Assert
        expect(booking.getTotalPrice()).toBe(14 * 175 * 0.9); 
    });

    it("não deve realizar o agendamento, quando uma propriedade não estiver disponível", () => {
        // Arrange
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        const user = new User("1", "Aline Assunção");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-15"));

        // Act
        const booking = new Booking("1", property, user, dateRange, 4);
        const dateRange2 = new DateRange(new Date("2023-10-10"), new Date("2023-10-20"));

        // Assert
        expect(() => {
            new Booking("2", property, user, dateRange2, 4); 
        }).toThrow("A propriedade não está disponível para as datas selecionadas.");
    });

    it("deve cancelar uma reserva sem reembolso quando faltam menos de 1 dia para o check-in", () => {
        
        const property = new Property("3", "Apartamento", "Terceiro andar", 4, 400);
        const user = new User("2", "Daniel Filho");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-03"));
        const booking = new Booking("1", property, user, dateRange, 2);

        const currentDate = new Date("2023-10-01");
        booking.cancel(currentDate);
        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(800); 
    });

    it("deve cancelar uma reserva com reembolso total quando a data for superior a 7 dias antes do check-in", () => {
        
        const property = new Property("3", "Apartamento", "Terceiro andar", 4, 400);
        const user = new User("2", "Daniel Filho");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-03"));
        const booking = new Booking("1", property, user, dateRange, 2);

        const currentDate = new Date("2023-09-01");
        booking.cancel(currentDate);
        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(0); 
    });

    it("deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 e 7 dias do check-in", () => {
        
        const property = new Property("3", "Apartamento", "Terceiro andar", 4, 400);
        const user = new User("2", "Daniel Filho");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-03"));
        const booking = new Booking("1", property, user, dateRange, 2);

        const currentDate = new Date("2023-09-29");
        booking.cancel(currentDate);
        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(400 * 2 * 0.5); 
    });

    it("não pode cancelar uma reserva mais de uma vez", () => {
        
        const property = new Property("3", "Apartamento", "Terceiro andar", 4, 400);
        const user = new User("2", "Daniel Filho");
        const dateRange = new DateRange(new Date("2023-10-01"), new Date("2023-10-02"));
        const booking = new Booking("1", property, user, dateRange, 2);

        const currentDate = new Date("2023-09-29");
        booking.cancel(currentDate);
        expect(() => {
            booking.cancel(currentDate);
        }).toThrow("Reserva já foi cancelada.");
    });
});