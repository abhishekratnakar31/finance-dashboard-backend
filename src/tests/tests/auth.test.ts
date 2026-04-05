import request from "supertest"
import { app, buildApp } from "../../app.js"
import prisma from "../../utils/prisma.js"

beforeAll(async () => {
    await buildApp();
    await app.ready();
    // Cleanup records first to avoid foreign key constraint errors
    await prisma.financeRecord.deleteMany({ where: { user: { email: { contains: "testauth" } } } });
    await prisma.user.deleteMany({ where: { email: { contains: "testauth" } } });
});

describe("Auth Routes", () => {
    const testUser = {
        name: "Auth Test User",
        email: "testauth@test.com",
        password: "password123",
        role: "ADMIN"
    };

    test("Register user successfully", async () => {
        const response = await request(app.server)
            .post("/auth/register")
            .send(testUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("user created");
        expect(response.body.user.email).toBe(testUser.email);
    });

    test("Fail to register user with existing email", async () => {
        const response = await request(app.server)
            .post("/auth/register")
            .send(testUser);

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe("Email already in use");
    });

    test("Login user successfully", async () => {
        const response = await request(app.server)
            .post("/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    test("Fail to login with invalid credentials", async () => {
        const response = await request(app.server)
            .post("/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid Credentials");
    });
})