import type { FastifyRequest, FastifyReply } from "fastify"
import prisma from "../utils/prisma.js"
import bcrypt from  "bcrypt"

export async function registeruser(req: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, role } = req.body as any

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return reply.status(409).send({ message: "Email already in use" })
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashpassword,
            role
        }
    })

    return reply.send({
        message: "user created",
        user
    })
}


export async function loginuser(req: FastifyRequest, reply: FastifyReply){
    const {email, password} = req.body as any
    const user =await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        return reply.status(401).send({message:"Invalid Credentials"})
    }

    const validpassword = await bcrypt.compare(password, user.password)

    if(!validpassword){
        return reply.status(401).send({message:"Invalid Credentials"})
    }

    const token = reply.server.jwt.sign({
        id:user.id,
        role:user.role
    })
    return reply.send({token})
}