import {z} from "zod"

export const createRecordSchema = z.object({
    amount:z.number(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category:z.string(),
    date:z.string(),
    notes:z.string().optional()
})