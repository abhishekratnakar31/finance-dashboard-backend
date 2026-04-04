import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; role: string } // payload type is used for sign and verify
    user: { id: string; role: string } // user type is used for req.user
  }
}
