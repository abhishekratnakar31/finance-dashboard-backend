import prisma from "../utils/prisma.js"
import type { FastifyRequest, FastifyReply } from "fastify"
import { createRecordSchema, updateRecordSchema } from "../utils/validation.js"

export interface CreateRecordBody {
    amount: number
    type: "INCOME" | "EXPENSE"
    category: string
    date: string
    notes?: string
}

export interface UpdateRecordBody {
    amount?: number
    type?: "INCOME" | "EXPENSE"
    category?: string
    date?: string
    notes?: string
}

export interface ParamsWithId {
    id: string
}

export interface GetRecordsQuery {
    page?: number
    limit?: number
    type?: "INCOME" | "EXPENSE"
    category?: string
    search?: string
}

export async function createRecord(req: FastifyRequest<{ Body: CreateRecordBody }>, reply: FastifyReply) {
    const parsed = createRecordSchema.safeParse(req.body)

    if (!parsed.success) {
        return reply.status(400).send({
            message: "Validation failed",
            errors: parsed.error.issues
        })
    }

    try {
        const { amount, type, category, date, notes } = parsed.data
        
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
            return reply.status(400).send({ message: "Invalid date format" })
        }

        // Check if user exists on request (added via JWT middleware)
        const userId = (req.user as { id: string }).id

        const record = await prisma.financeRecord.create({
            data: {
                amount,
                type,
                category,
                date: parsedDate,
                notes: notes ?? null,
                createdBy: userId
            }
        })

        return reply.send({
            message: "Record created successfully",
            record
        })
    } catch (error: any) {
        return reply.status(500).send({
            message: "Failed to create record",
            error: error.message
        })
    }
}

export async function getRecords(req: FastifyRequest<{ Querystring: GetRecordsQuery }>, reply: FastifyReply) {
    const { page = 1, limit = 10, type, category, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const userId = (req.user as { id: string }).id
    const where: any = { deletedAt: null, createdBy: userId }
    
    if (category) where.category = category
    if (type) where.type = type
    if (search) {
        where.OR = [
            { category: { contains: search } },
            { notes: { contains: search } }
        ]
    }

    const records = await prisma.financeRecord.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
            date: "desc"
        }
    })

    return reply.send(records)
}

export async function updateRecord(req: FastifyRequest<{ Params: ParamsWithId, Body: UpdateRecordBody }>, reply: FastifyReply) {
    const { id } = req.params
    const parsed = updateRecordSchema.safeParse(req.body)

    if (!parsed.success) {
        return reply.status(400).send({
            message: "Validation failed",
            errors: parsed.error.issues
        })
    }

    const { amount, type, category, date, notes } = parsed.data

    const data: any = {}
    if (amount !== undefined) data.amount = amount
    if (type !== undefined) data.type = type
    if (category !== undefined) data.category = category
    if (date !== undefined) {
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
            return reply.status(400).send({ message: "Invalid date format" })
        }
        data.date = parsedDate
    }
    if (notes !== undefined) data.notes = notes ?? null

    try {
        const updated = await prisma.financeRecord.update({
            where: { id },
            data
        })

        return reply.send(updated)
    } catch (error: any) {
        return reply.status(500).send({
            message: "Failed to update record",
            error: error.message
        })
    }
}

export async function deleteRecord(req: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
    const { id } = req.params

    try {
        await prisma.financeRecord.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })

        return reply.send({
            message: "Record deleted successfully"
        })
    } catch (error: any) {
        return reply.status(500).send({
            message: "Failed to delete record",
            error: error.message
        })
    }
}