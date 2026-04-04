import type { FastifyInstance } from "fastify"
import {
    getSummary,
    getCategorySummary,
    getMonthlyTrends,
    getRecentActivity
} from "../controllers/dashboard.controller.js"

import { authenticate } from "../middleware/auth.middleware.js"

export default async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get("/dashboard/summary", { preHandler: authenticate }, getSummary)

    fastify.get("/dashboard/category-summary", {
        preHandler: authenticate
    }, getCategorySummary)

    fastify.get("/dashboard/monthly-trends", {
        preHandler: authenticate
    }, getMonthlyTrends)

    fastify.get("/dashboard/recent-activity", {
        preHandler: authenticate
    }, getRecentActivity)
}