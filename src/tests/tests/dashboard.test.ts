import request from "supertest"
import { app, buildApp } from "../../app.js"
import prisma from "../../utils/prisma.js"

let token: string;
const testUser = {
    name: "Dashboard Test User",
    email: "testdashboard@test.com",
    password: "password123",
    role: "ADMIN"
};

beforeAll(async () => {
    await buildApp();
    await app.ready();

    // Cleanup and setup test user
    await prisma.financeRecord.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });

    await request(app.server)
        .post("/auth/register")
        .send(testUser);

    const loginRes = await request(app.server)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
    
    token = loginRes.body.token;

    // Seed some data
    await prisma.financeRecord.create({
        data: {
            amount: 500,
            type: "INCOME",
            category: "Salary",
            date: new Date(),
            createdBy: (await prisma.user.findUnique({ where: { email: testUser.email } }))!.id
        }
    });

    await prisma.financeRecord.create({
        data: {
            amount: 50,
            type: "EXPENSE",
            category: "Food",
            date: new Date(),
            createdBy: (await prisma.user.findUnique({ where: { email: testUser.email } }))!.id
        }
    });
});

describe("Dashboard Routes", () => {
    test("GET /dashboard/summary", async () => {
        const response = await request(app.server)
            .get("/dashboard/summary")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("totalIncome");
        expect(response.body).toHaveProperty("totalExpense");
        expect(response.body).toHaveProperty("netBalance");
    });

    test("GET /dashboard/category-summary", async () => {
        const response = await request(app.server)
            .get("/dashboard/category-summary")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /dashboard/monthly-trends", async () => {
        const response = await request(app.server)
            .get("/dashboard/monthly-trends")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(Array.isArray(response.body)).toBe(false);
    });

    test("GET /dashboard/recent-activity", async () => {
        const response = await request(app.server)
            .get("/dashboard/recent-activity")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
})