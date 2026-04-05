import request from "supertest"
import { app, buildApp } from "../../app.js"

beforeAll(async () => {
    await buildApp();
    await app.ready();
});

describe("Auth Routes", () => {
  test("Register user", async () => {
    const response = await request(app.server)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "123456",
        role: "ADMIN"
      })

    // Check that it's not a 404, proving the route exists
    expect(response.statusCode).not.toBe(404)
  })
})