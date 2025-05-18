import { PropertyService } from "./property_service";
import { Property } from "../domain/entities/property";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository";

describe("PropertyService", () => {

    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    });

    it("deve retornar null quando um ID invalido for passado", async () => {
        const property = await propertyService.findPropertyById("999");
        expect(property).toBeNull();
    });

    it("deve retornar uma propriedade quando um ID válido for passado", async () => {
        const property = await propertyService.findPropertyById("1");
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("1");
        expect(property?.getName()).toBe("Casa de Campo");
    });

    it("deve salvar uma nova propriedade com sucesso usando repositorio fake e buscando novamente", async () => {
        const newProperty = new Property("4", "Casa de Praia", "Linda casa na praia", 6, 200);
        await fakePropertyRepository.saveProperty(newProperty);
        const property = await propertyService.findPropertyById("4");
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("4");
        expect(property?.getName()).toBe("Casa de Praia");
    });
});