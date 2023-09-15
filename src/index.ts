import "@infinite-fansub/logger/config";

import { createServer } from "node:http";
import { join } from "node:path";
import express from "express";

import { IPFixedWindowLimiting, LoggerMiddleware } from "./middleware";
import { initializeIndexes } from "./database";
import { v1Router } from "./routers";

import type { ErrorResponse } from "./typings/shared";

(async () => {
    // Create the RediSearch indexes
    await initializeIndexes();

    if (process.env.ENVIRONMENT === "development") {
        const { populateTestUsers } = await import("./database/populate");
        await populateTestUsers();
    }

    //deepcode ignore UseHelmetForExpress: I don't think helmet is really needed for our use case, deepcode ignore UseCsurfForExpress: We already use api keys therefor i don't think this is needed
    const app = express();

    // `Response.json` will indent with 4 spaces
    app.set("json spaces", 4);
    // Remove header
    app.disable("x-powered-by");
    app.use(LoggerMiddleware);
    app.use(await IPFixedWindowLimiting({
        limit: 150,
        windowInMs: 60000
    }));

    // api versioning
    app.use("/v1", v1Router);

    app.use("/public", express.static(join(__dirname, "public")));

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