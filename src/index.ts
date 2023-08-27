import "@infinite-fansub/logger/config";

import { createServer } from "node:http";
import { join } from "node:path";
import express from "express";

import { LoggerMiddleware } from "./utils/middleware";
import { client } from "nekdis";

(async () => {
    await client.connect().then(() => {
        logger.log("Connected to Redis!");
    });

    await import(join(__dirname, "nekdis"));

    const app = express();

    app.set("json spaces", 4);
    app.use(LoggerMiddleware);

    app.get("*", (_, res) => {
        res.status(404).json({
            error: "This route does not exist"
        });
    });

    createServer(app).listen(8080, "0.0.0.0", () => {
        logger.infinitePrint("API listening on port 8080");
    });
})();