import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";

export class UserMapper {
    static toDomain(userEntity: UserEntity): User {
        return new User(userEntity.id, userEntity.name);
    }

    static toPersistence(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.getId();
        entity.name = user.getName();
        return entity;
    }
}