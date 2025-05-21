import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "./typeorm_user_repository";

describe("TypeORMUserRepository", () => {

    let dataSource: DataSource;
    let userRepository: TypeORMUserRepository;
    let repository: Repository<UserEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity],
            synchronize: true,
            logging: false,
        });

        await dataSource.initialize();
        repository = dataSource.getRepository(UserEntity);
        userRepository = new TypeORMUserRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve criar um usuario com sucesso", async () => {
        const user = new User("1", "Ana Clara");
        await userRepository.saveUser(user);

        const savedUser = await repository.findOne({ where: { id: "1" } });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe("1");
        expect(savedUser?.name).toBe("Ana Clara");
    });

    it("deve retornar um usuário quando o ID for valido", async () => {
        const user = new User("1", "Ana Clara");
        await userRepository.saveUser(user);

        const savedUser = await userRepository.findUserById("1");
        expect(savedUser).not.toBeNull();
        expect(savedUser?.getId()).toBe("1");
        expect(savedUser?.getName()).toBe("Ana Clara");
    });

    it("deve retornar um usuário quando o ID for valido", async () => {
        const savedUser = await userRepository.findUserById("6");
        expect(savedUser).toBeNull();
    });
});