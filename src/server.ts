import Fastify from "fastify";
import cors from "@fastify/cors";
import prisma  from "./utils/prisma.js";
import jwt from "@fastify/jwt"
import recordRoutes from "./routes/records.routes.js"


const fastify = Fastify({
  logger: true,
});

async function start() {
  await fastify.register(cors);
  await fastify.register(jwt,{
    secret:"secret"
  })
  // Register routes
  await fastify.register(import("./routes/auth.routes.js"), { prefix: "/auth" });
  await fastify.register(recordRoutes)

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
