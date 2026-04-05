import prisma from "../utils/prisma.js"
import type { FastifyRequest, FastifyReply } from "fastify"
import { createRecordSchema } from "../utils/validation.js"

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
        
        // Check if user exists on request (added via JWT middleware)
        const userId = (req.user as { id: string }).id

        const record = await prisma.financeRecord.create({
            data: {
                amount,
                type,
                category,
                date: new Date(date),
                notes: notes || null,
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
   

export async function getRecords(req: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10, type, category, search } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)

    const userId = (req.user as { id: string }).id
    const where: any = { deletedAt: null, createdBy: userId }
    if (category) where.category = category
    if (type) where.type = type
    if (search) {
        where.notes = {
            contains: search,
            mode: 'insensitive'
        }
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

    const updated = await prisma.financeRecord.update({
        where: { id },
        data: req.body
    })

    return reply.send(updated)
}

export async function deleteRecord(req: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
    const { id } = req.params

    await prisma.financeRecord.update({
        where: { id },
        data:{
            deletedAt: new Date()
        }
    })

    return reply.send({
        message: "Record deleted"
    })
}