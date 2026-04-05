import {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    type CreateRecordBody,
    type UpdateRecordBody,
    type GetRecordsQuery,
    type ParamsWithId
} from "../controllers/record.controller.js"

import { authenticate } from "../middleware/auth.middleware.js"

import type { FastifyInstance } from "fastify"

export default async function recordRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: CreateRecordBody }>("/records", {
        preHandler: authenticate,
        schema: {
            description: "Create a new financial record",
            tags: ["Records"],
            security: [{ bearerAuth: [] }],
            body: {
                type: "object",
                required: ["amount", "type", "category", "date"],
                properties: {
                    amount: { type: "number" },
                    type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                    category: { type: "string" },
                    date: { type: "string" },
                    notes: { type: "string" }
                }
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        record: { type: "object" }
                    }
                }
            }
        }
    }, createRecord)

    fastify.get<{ Querystring: GetRecordsQuery }>("/records", {
        preHandler: authenticate,
        schema: {
            description: "Get all financial records for the authenticated user",
            tags: ["Records"],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 },
                    type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                    category: { type: "string" },
                    search: { type: "string" }
                }
            }
        }
    }, getRecords)

    fastify.patch<{ Params: ParamsWithId, Body: UpdateRecordBody }>("/records/:id", {
        preHandler: authenticate,
        schema: {
            description: "Update an existing financial record",
            tags: ["Records"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string" }
                }
            },
            body: {
                type: "object",
                properties: {
                    amount: { type: "number" },
                    type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                    category: { type: "string" },
                    date: { type: "string" },
                    notes: { type: "string" }
                }
            }
        }
    }, updateRecord)

    fastify.delete<{ Params: ParamsWithId }>("/records/:id", {
        preHandler: authenticate,
        schema: {
            description: "Soft delete a financial record",
            tags: ["Records"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }, deleteRecord)
}