import { readFile } from "node:fs/promises";

import { client } from "../database/client";

import type { RequestHandler } from "express";
import type { ErrorResponse } from "../typings/shared";
import { join } from "node:path";

export async function IPFixedWindowLimiting(options: { limit: number, windowInMs: number }): Promise<RequestHandler> {
    await client.raw.functionLoad((
        await readFile(join(__dirname, "../utils/fixed-window-rate-limit.lua"))
    ).toString("utf8"), { REPLACE: true });

    return async (req, res, next) => {
        const { ip } = req;

        const key = `Holocure:RateLimit:${ip}`;

        const hits = await client.raw.sendCommand(["FCALL", "fwrl", "1", key, options.windowInMs.toString()]);

        if (typeof hits !== "number") {
            return res.status(500).json({
                code: 500,
                error: "Unexpected behavior"
            } satisfies ErrorResponse);
        }

        if (hits > options.limit) {
            return res.status(429).json({
                code: 429,
                error: "Rate limit exceeded"
            } satisfies ErrorResponse);
        }

        return next();
    };
}