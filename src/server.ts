import "dotenv/config";
import { app, buildApp } from "./app.js";

async function start() {
    try {
        await buildApp();
        const port = Number(process.env.PORT) || 3000;
        await app.listen({ port, host: "0.0.0.0" });
        console.log(`server running on port:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
