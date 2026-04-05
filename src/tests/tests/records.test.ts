import request from "supertest"
import { app, buildApp } from "../../app.js"

beforeAll(async () => {
    await buildApp();
    await app.ready();
});

describe("Record Routes", () => {
  test("Create record endpoint exists", async () => {
    const response = await request(app.server)
      .post("/records")

    expect(response.statusCode).not.toBe(404)
  })
})