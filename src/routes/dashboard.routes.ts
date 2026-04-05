import type { FastifyInstance } from "fastify"
import {
    getSummary,
    getCategorySummary,
    getMonthlyTrends,
    getRecentActivity
} from "../controllers/dashboard.controller.js"

import { authenticate } from "../middleware/auth.middleware.js"

export default async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get("/dashboard/summary", {
        preHandler: authenticate,
        schema: {
            description: "Get summary of income and expenses",
            tags: ["Dashboard"],
            security: [{ bearerAuth: [] }]
        }
    }, getSummary)

    fastify.get("/dashboard/category-summary", {
        preHandler: authenticate,
        schema: {
            description: "Get income/expense summary grouped by category",
            tags: ["Dashboard"],
            security: [{ bearerAuth: [] }]
        }
    }, getCategorySummary)

    fastify.get("/dashboard/monthly-trends", {
        preHandler: authenticate,
        schema: {
            description: "Get monthly income/expense trends",
            tags: ["Dashboard"],
            security: [{ bearerAuth: [] }]
        }
    }, getMonthlyTrends)

    fastify.get("/dashboard/recent-activity", {
        preHandler: authenticate,
        schema: {
            description: "Get recent financial activities",
            tags: ["Dashboard"],
            security: [{ bearerAuth: [] }]
        }
    }, getRecentActivity)
}