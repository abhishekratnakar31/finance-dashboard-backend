import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  type CreateRecordBody,
  type UpdateRecordBody,
  type ParamsWithId
} from "../controllers/record.controller.js"

import { authenticate } from "../middleware/auth.middleware.js"

import type { FastifyInstance } from "fastify"

export default async function recordRoutes(fastify: FastifyInstance) {

  fastify.post<{ Body: CreateRecordBody }>("/records", { preHandler: authenticate }, createRecord)

  fastify.get("/records", { preHandler: authenticate }, getRecords)

  fastify.patch<{ Params: ParamsWithId, Body: UpdateRecordBody }>("/records/:id", { preHandler: authenticate }, updateRecord)

  fastify.delete<{ Params: ParamsWithId }>("/records/:id", { preHandler: authenticate }, deleteRecord)

}