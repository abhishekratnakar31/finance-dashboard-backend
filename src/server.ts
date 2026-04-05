import "dotenv/config";
import { app, buildApp } from "./app.js";

async function start() {
    try {
        await buildApp();
        await app.listen({ port: 3000 });
        console.log("server running on port:3000");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
