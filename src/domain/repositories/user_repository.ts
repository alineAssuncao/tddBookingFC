import { User } from "../entities/user";

export interface UserRepository {
  findUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
}