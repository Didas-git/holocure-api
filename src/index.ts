import "@infinite-fansub/logger/config";

import { createServer } from "node:http";
import { join } from "node:path";
import express from "express";

import { LoggerMiddleware } from "./utils/middleware";
import { v1Router } from "./routers/index";

import type { ErrorResponse } from "./typings/shared";

(async () => {
    // Lazy loading so the redis client is defined when the models are created
    const { initializeIndexes } = await import(join(__dirname, "nekdis"));
    // Create the RediSearch indexes
    await initializeIndexes();

    const app = express();

    // `Response.json` will indent with 4 spaces
    app.set("json spaces", 4);
    app.use(LoggerMiddleware);

    // api versioning
    app.use("/v1", v1Router);

    // Default fallback, order does matter
    app.all("*", (_, res) => {
        res.status(404).json({
            code: 404,
            error: "Invalid route"
        } satisfies ErrorResponse);
    });

    // Use IPV4 to create the connection
    createServer(app).listen(8080, "0.0.0.0", () => {
        logger.infinitePrint("API listening on port 8080");
    });
})();