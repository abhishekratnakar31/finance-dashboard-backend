import { z } from "zod"

export const createRecordSchema = z.object({
    amount: z.number(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string(),
    date: z.string(),
    notes: z.string().optional()
})

export const updateRecordSchema = z.object({
    amount: z.number().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    notes: z.string().optional()
})