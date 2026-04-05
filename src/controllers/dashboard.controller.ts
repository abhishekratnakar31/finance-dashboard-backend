import prisma from "../utils/prisma.js"
import type { FastifyRequest, FastifyReply } from "fastify"

export async function getSummary(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as { id: string }).id

    const income = await prisma.financeRecord.aggregate({
        _sum: { amount: true },
        where: { 
            type: "INCOME",
            deletedAt: null,
            createdBy: userId
        }
    })

    const expense = await prisma.financeRecord.aggregate({
        _sum: { amount: true },
        where: { 
            type: "EXPENSE",
            deletedAt: null,
            createdBy: userId
        }
    })

    const totalIncome = income._sum?.amount || 0
    const totalExpense = expense._sum?.amount || 0

    return reply.send({
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
    })
}

export async function getCategorySummary(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as { id: string }).id
    
    const data = await prisma.financeRecord.groupBy({
        by: ["category"],
        _sum: { amount: true },
        where: {
            deletedAt: null,
            createdBy: userId
        }
    })

    return reply.send(data)
}

export async function getMonthlyTrends(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as { id: string }).id

    const records = await prisma.financeRecord.findMany({
        where: {
            deletedAt: null,
            createdBy: userId
        },
        select: {
            amount: true,
            date: true,
        }
    })

    const monthly: Record<string, number> = {}

    records.forEach(record => {
        const month = new Date(record.date).toLocaleString("default", {
            month: "short"
        })
        monthly[month] = (monthly[month] || 0) + record.amount
    })

    return reply.send(monthly)
}

export async function getRecentActivity(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as { id: string }).id

    const records = await prisma.financeRecord.findMany({
        where: {
            deletedAt: null,
            createdBy: userId
        },
        take: 5,
        orderBy: {
            date: "desc"
        }
    })
    return reply.send(records)
}