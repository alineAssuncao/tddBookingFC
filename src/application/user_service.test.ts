import { User } from "../domain/entities/user";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
import { UserService } from "./user_service";

describe("UserService", () => {

  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("deve retornar null quando um ID invalido for passado", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("deve retornar um usuário quando um ID válido for passado", async () => {
    const user = await userService.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("Aline Assunção");
  });

  it("deve salvar um novo usuário com sucesso usando repositorio fake e buscando novamente", async () => {
    const newUser = new User("4", "Fernando Silva");
    await fakeUserRepository.saveUser(newUser);
    const user = await userService.findUserById("4");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("4");
    expect(user?.getName()).toBe("Fernando Silva");
  });

});