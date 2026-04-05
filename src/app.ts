import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt"
import swagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"

import authRoutes from "./routes/auth.routes.js"
import recordRoutes from "./routes/records.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"

export const app = Fastify({
    logger: true,
});

export async function buildApp() {
    await app.register(cors);
    
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || "supersecret"
    })

    await app.register(swagger, {
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

    await app.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false
        }
    })

    // Register routes
    await app.register(authRoutes, { prefix: "/auth" });
    await app.register(recordRoutes)
    await app.register(dashboardRoutes)

    app.get("/", async () => {
        return { message: "FDB api running" };
    });

    return app;
}
