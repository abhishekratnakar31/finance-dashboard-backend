import request from "supertest"
import { app, buildApp } from "../../app.js"
import prisma from "../../utils/prisma.js"

let token: string;
const testUser = {
    name: "Record Test User",
    email: "testrecord@test.com",
    password: "password123",
    role: "ANALYST"
};

beforeAll(async () => {
    await buildApp();
    await app.ready();

    // Cleanup and setup test user
    await prisma.financeRecord.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });

    const regRes = await request(app.server)
        .post("/auth/register")
        .send(testUser);
    expect(regRes.statusCode).toBe(200);

    const loginRes = await request(app.server)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.statusCode).toBe(200);
    
    token = loginRes.body.token;
    expect(token).toBeDefined();
});

describe("Record Routes", () => {
    let recordId: string;

    test("Create record successfully", async () => {
        const response = await request(app.server)
            .post("/records")
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 100.50,
                type: "EXPENSE",
                category: "Food",
                date: new Date().toISOString(),
                notes: "Dinner"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.record).toHaveProperty("id");
        recordId = response.body.record.id;
    });

    test("Get all records", async () => {
        const response = await request(app.server)
            .get("/records")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Update record successfully", async () => {
        const response = await request(app.server)
            .patch(`/records/${recordId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 120.00,
                notes: "Updated dinner"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.amount).toBe(120.00);
    });

    test("Delete record (soft delete)", async () => {
        const response = await request(app.server)
            .delete(`/records/${recordId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        
        // Verify it's gone from normal list
        const listRes = await request(app.server)
            .get("/records")
            .set("Authorization", `Bearer ${token}`);
        
        const deletedRecord = listRes.body.find((r: any) => r.id === recordId);
        expect(deletedRecord).toBeUndefined();
    });

    test("Fail to create record without token", async () => {
        const response = await request(app.server)
            .post("/records")
            .send({
                amount: 50,
                type: "INCOME",
                category: "Salary",
                date: new Date().toISOString()
            });

        expect(response.statusCode).toBe(401);
    });

    test("Fail to create record with invalid date", async () => {
        const response = await request(app.server)
            .post("/records")
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 50,
                type: "INCOME",
                category: "Salary",
                date: "not-a-date"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid date format");
    });
})