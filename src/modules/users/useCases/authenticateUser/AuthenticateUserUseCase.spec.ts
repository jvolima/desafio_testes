import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate an user", async () => {
    const user = {
      email: "user@test.com",
      name: "user test",
      password: "test",
    };

    await createUserUseCase.execute(user);

    const authenticateReturn = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticateReturn).toHaveProperty("token")
  });

  it("should not be able to authenticate an user if email is wrong", async () => {
    expect(async () => {
      const user = {
        email: "user@test.com",
        name: "user test",
        password: "test",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "wrong@email.teste",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it("should not be able to authenticate an user if password is wrong", async () => {
    expect(async () => {
      const user = {
        email: "user@test.com",
        name: "user test",
        password: "test",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
