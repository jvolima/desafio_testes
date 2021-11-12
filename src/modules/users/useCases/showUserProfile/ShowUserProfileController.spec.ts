import request from "supertest"
import { Connection } from "typeorm"
import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection

describe("Show user profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to show user profile", async () => {
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

    const response = await request(app).get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
  })
})