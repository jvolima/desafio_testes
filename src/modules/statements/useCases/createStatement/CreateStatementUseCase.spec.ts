import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to create a new statement", async () => {
    const user = {
      name: "User test",
      email: "user@test.com",
      password: "test"
    }

    const userCreated = await inMemoryUsersRepository.create(user);

    const user_id = userCreated.id as string

    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Test"
    })

    expect(statement).toHaveProperty("id")
  })

  it("should not be able to create a new statement if user does not exists", async () => {
    expect(async () => {
      const statement = await createStatementUseCase.execute({
        user_id: "wrong",
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "Test"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to create a withdraw statement if the amount is greater than the balance", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "user@test.com",
        password: "test"
      }

      const userCreated = await inMemoryUsersRepository.create(user);

      const user_id = userCreated.id as string

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "Test"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
