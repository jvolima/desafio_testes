import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = {
      email: "user@test.com",
      name: "user test",
      password: "test",
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id")
  });

  it("should not be able to create a user with an existent email", async () => {
    expect(async () => {
      const user = {
        email: "user@test.com",
        name: "user test",
        password: "test",
      };

      const userExists = {
        email: "user@test.com",
        name: "test user",
        password: "test1",
      };
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
