import { User } from "./user";

describe("User Entity", () => {
    it("deve criar uma instância deUser com ID e Nome", () => {
        const user = new User("1", "Aline Assunção");
        expect(user.getId()).toBe("1");
        expect(user.getName()).toBe("Aline Assunção");
    });

    it("deve lançar um erro se o nome for vazio", () => {
        expect(() => new User("1", "")).toThrow("O nome é obrigatório.")
    })

    it("deve lançar um erro se o id for vazio", () => {
        expect(() => new User("", "Aline Assunção")).toThrow("O id é obrigatório.")
    })
});