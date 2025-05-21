import { Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserRepository } from "../../domain/repositories/user_repository";
import { UserMapper } from "../persistence/mappers/user_mapper";

export class TypeORMUserRepository implements UserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor(repository: Repository<UserEntity>) {
        this.repository = repository;
    }
    
    async saveUser(user: User): Promise<void> {
        const userEntity = UserMapper.toPersistence(user);
        await this.repository.save(userEntity);
    }

    async findUserById(id: string): Promise<User | null> {
        const userEntity = await this.repository.findOne({ where: { id } });
        return userEntity ? UserMapper.toDomain(userEntity) : null;
    }
       
}
