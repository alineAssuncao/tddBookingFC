import {DateRange} from "./date_range";

describe ("DataRange Value Objects", () => {
    it("deve lançar um erro se a data de término for antes aa data de inicio", () => {
        expect(() => {
            new DateRange(new Date("2025-05-10"), new Date("2025-05-05"));
        }).toThrow("A data de término deve ser posterior à data de início.");
    });

    it("deve criar uma instância d DataRange com a data de inicio e de termino, e verificar o retorno", () =>{
        const startDate = new Date("2025-05-05");
        const endDate = new Date("2025-05-10");
        const dataRange = new DateRange(startDate, endDate);
        expect(dataRange.getStartDate()).toEqual(startDate);
        expect(dataRange.getEndDate()).toEqual(endDate);
    });
});