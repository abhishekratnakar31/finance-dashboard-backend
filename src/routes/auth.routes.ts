import type { FastifyInstance } from "fastify"
import { registeruser, loginuser } from "../controllers/auth.controller.js"

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/register", {
        schema: {
            description: "Register a new user",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"] }
                }
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        user: { type: "object" }
                    }
                }
            }
        }
    }, registeruser)

    fastify.post("/login", {
        schema: {
            description: "Login user",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                        user: { type: "object" }
                    }
                }
            }
        }
    }, loginuser)
}