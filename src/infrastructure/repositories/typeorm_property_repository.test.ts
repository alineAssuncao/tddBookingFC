import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";

describe("TypeORMPropertyRepository", () => {

    let dataSource: DataSource;
    let propertyRepository: TypeORMPropertyRepository;
    let repository: Repository<PropertyEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity, PropertyEntity, BookingEntity],
            synchronize: true,
            logging: false,
        });

        await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeORMPropertyRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve criar uma propriedade com sucesso", async () => {
        const property = new Property("1", "Casa", "Rua movimentada", 6, 100);

        await propertyRepository.saveProperty(property);

        const savedProperty = await repository.findOne({ where: { id: "1" } });
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    });

    it("deve retornar uma propriedade com ID valido", async () => {
        const property = new Property("1", "Casa", "Rua movimentada", 6, 100);

        await propertyRepository.saveProperty(property);
        
        const savedProperty = await propertyRepository.findPropertyById("1");
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe("1");
        expect(savedProperty?.getName()).toBe("Casa");
        expect(savedProperty?.getDescription()).toBe("Rua movimentada");
        expect(savedProperty?.getMaxGuests()).toBe(6);
        expect(savedProperty?.getBasePrice()).toBe(100);
    });

    it("deve retornar null quando ID for invalido", async () => {        
        const property = await propertyRepository.findPropertyById("999");
        expect(property).toBeNull();
    });
});