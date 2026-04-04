import prisma from "../utils/prisma.js"
import type { FastifyRequest, FastifyReply } from "fastify"

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

    const { amount, type, category, date, notes } = req.body
    
    // Check if user exists on request (added via JWT middleware)
    const userId = (req.user as { id: string }).id

    const record = await prisma.financeRecord.create({
        data: {
            amount,
            type,
            category,
            date: new Date(date),
            notes: notes ?? null,
            createdBy: userId
        }
    })

    return reply.send({
        message: "Record created",
        record
    })
}   

export async function getRecords(req: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10, type, category, search } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
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

    await prisma.financeRecord.delete({
        where: { id }
    })

    return reply.send({
        message: "Record deleted"
    })
}