import { Property } from "./property";
import { DateRange } from "../value_objects/date_range";

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
});