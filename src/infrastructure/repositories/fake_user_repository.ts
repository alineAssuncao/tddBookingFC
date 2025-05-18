import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [
    new User("1", "Aline Assunção"),
    new User("2", "Lucas Lima"),
    new User("3", "Ana Maria"),
  ];

  async findUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.getId() === id) || null;
  }

  async saveUser(user: User) {
    this.users.push(user);
  }
}