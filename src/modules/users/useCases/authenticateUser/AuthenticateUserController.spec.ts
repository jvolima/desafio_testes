import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to authenticate an user", async () => {
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

    expect(responseToken.body).toHaveProperty("token")
  })

  it("should not be able to authenticate an user if email is incorrect", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test"
    })

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "user@wrong.com",
      password: "test"
    })

    expect(responseToken.status).toBe(401)
  })

  it("should not be able to authenticate an user if password is incorrect", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test"
    })

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "user@test.com",
      password: "wrong"
    })

    expect(responseToken.status).toBe(401)
  })
})