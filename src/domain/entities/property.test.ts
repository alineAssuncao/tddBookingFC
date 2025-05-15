import { Property } from "./property";

describe("Property Entity", () => {
    it("deve criar uma instancia de Property com todo os atritutos", () => {
        const property = new Property("1", "Casa de campo", "Casa tranquila, junto a natureza", 4, 175);
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Casa de campo");
        expect(property.getDescription()).toBe("Casa tranquila, junto a natureza");
        expect(property.geMaxGuests()).toBe(4);
        expect(property.getBasePrice()).toBe(175);
    });
});