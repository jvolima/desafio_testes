import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to make an deposit", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test"
    })

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "user@test.com",
      password: "test"
    })

    const { token } = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "Testing deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
  })

  it("should be able to make an withdraw", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test"
    })

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "user@test.com",
      password: "test"
    })

    const { token } = responseToken.body

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Testing withdraw"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
  })
})
