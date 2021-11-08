import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get user balance", async () => {
    const user = {
      name: "User test",
      email: "user@test.com",
      password: "test"
    }

    const userCreated = await inMemoryUsersRepository.create(user);

    const user_id = userCreated.id as string;

    await inMemoryStatementsRepository.create({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Test"
    })

    const balance = await getBalanceUseCase.execute({ user_id })

    expect(balance).toHaveProperty("balance")
  })

  it("should not be able to get balance if user does not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "wrong_id" })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
