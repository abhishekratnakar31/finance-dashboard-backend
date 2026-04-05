import request from "supertest"
import { app, buildApp } from "../../app.js"

beforeAll(async () => {
    await buildApp();
    await app.ready();
});

describe("Dashboard Routes", () => {
  test("Dashboard summary endpoint exists", async () => {
    const response = await request(app.server)
      .get("/dashboard/summary")

    expect(response.statusCode).not.toBe(404)
  })
})