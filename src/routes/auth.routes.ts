import type { FastifyInstance } from "fastify"
import {registeruser, loginuser} from "../controllers/auth.controller.js"

export default async function authRoutes(fastify: FastifyInstance){
    fastify.post("/register", registeruser)
    fastify.post("/login", loginuser)
}