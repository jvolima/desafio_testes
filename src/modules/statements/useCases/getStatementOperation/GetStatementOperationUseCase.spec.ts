import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to get an statement operation", async () => {
    const user = {
      name: "User test",
      email: "user@test.com",
      password: "test"
    }

    const userCreated = await inMemoryUsersRepository.create(user);

    const user_id = userCreated.id as string;

    const statement = await inMemoryStatementsRepository.create({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Test"
    })

    const statement_id = statement.id as string;

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    })

    expect(statementOperation).toHaveProperty("id")
    expect(statementOperation).toHaveProperty("user_id")
  })

  it("should not be able to get an statement operation if user does not exists", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "user@test.com",
        password: "test"
      }

      const userCreated = await inMemoryUsersRepository.create(user);

      const user_id = userCreated.id as string;

      const statement = await inMemoryStatementsRepository.create({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "Test"
      })

      const statement_id = statement.id as string;

      await getStatementOperationUseCase.execute({
        user_id: "wrong_id",
        statement_id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("should not be able to get an statement operation if statement does not exists", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "user@test.com",
        password: "test"
      }

      const userCreated = await inMemoryUsersRepository.create(user);

      const user_id = userCreated.id as string;

      const statement = await inMemoryStatementsRepository.create({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "Test"
      })

      const statement_id = statement.id as string;

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "wrong_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
