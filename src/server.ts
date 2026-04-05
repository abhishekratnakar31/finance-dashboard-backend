import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import prisma  from "./utils/prisma.js";
import jwt from "@fastify/jwt"
import authRoutes from "./routes/auth.routes.js"
import recordRoutes from "./routes/records.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"

import swagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"


const fastify = Fastify({
  logger: true,
});

async function start() {
  await fastify.register(cors);
  await fastify.register(jwt,{
    secret: process.env.JWT_SECRET || "supersecret"
  })

await fastify.register(swagger, {
    openapi: {
        info: {
            title: "Finance Dashboard Api",
            description: "Backend API for managing financial records",
            version: "1.0.0"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    }
})

await fastify.register(swaggerUI, {
  routePrefix:"/docs",
  uiConfig:{
    docExpansion:"list",
    deepLinking: false
  }
})

  // Register routes
  await fastify.register(authRoutes, { prefix: "/auth" });
  await fastify.register(recordRoutes)
  await fastify.register(dashboardRoutes)

  fastify.get("/", async () => {
    return { message: "FDB api running" };
  });



  // fastify.get("/get-db", async()=>{
  //   const users = await prisma.user.findMany()
  //   return users
  // })

  try {
    await fastify.listen({ port: 3000 });
    console.log("server ruuning on port:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
