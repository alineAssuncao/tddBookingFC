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

    it("deve calcularo total de noites corretamente", () => {
        const startDate = new Date("2025-05-05");
        const endDate = new Date("2025-05-10");
        const dataRange = new DateRange(startDate, endDate);

        const totalNights = dataRange.getTotalNights();
        expect(totalNights).toBe(5);

        const startDate1 = new Date("2025-05-05");
        const endDate1 = new Date("2025-05-20");
        const dataRange1 = new DateRange(startDate1, endDate1);

        const totalNights1 = dataRange1.getTotalNights();
        expect(totalNights1).toBe(15);
    });

    it("deve verificar se dois intervalos de datas se sobrepõem", () => {
        const dataRange1 = new DateRange(
            new Date("2024-05-05"),
            new Date("2024-05-10")
        );

        const dataRange2 = new DateRange(
            new Date("2024-05-05"),
            new Date("2024-05-20")
        );

        const overlaps = dataRange1.overlaps(dataRange2);

        expect(overlaps).toBe(true);
    });

    it("deve lançar erro se a data de inicio e termino forem iguais", () => {
        const date = new Date("2025-05-20");
        expect(() => {
            new DateRange(date, date);
        }).toThrow("A data de início e término não podem ser iguais.");
    });
});