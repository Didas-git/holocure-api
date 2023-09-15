import { limitRateModel } from "../database";

import type { RequestHandler } from "express";
import type { ErrorResponse } from "../typings/shared";

export function IPFixedWindowLimiting(options: { limit: number, windowInMinutes: number }): RequestHandler {
    return async (req, res, next) => {
        const { ip } = req;

        /*
         We expire the key after 3 days of inactivity to free up memory

         3 * 24 * 60 * 60
        */
        const expireTime = 259200;
        const currentMinute = Math.floor(Date.now() / 1000 / 60);
        const info = await limitRateModel.get(ip);

        if (!info) {
            await limitRateModel.createAndSave({
                $id: ip,
                minute: currentMinute,
                amount: 1
            });

            await limitRateModel.expire([ip], expireTime);

            return next();
        }

        const needsUpdate = currentMinute - options.windowInMinutes > info.minute;

        if (needsUpdate) {
            info.minute = currentMinute;
            info.amount = 1;
            await limitRateModel.save(info);

            await limitRateModel.expire([ip], expireTime);

            return next();
        }

        const amt = await limitRateModel.increment(ip);

        await limitRateModel.expire([ip], expireTime);

        if (amt > options.limit) {
            return res.status(429).json({
                code: 429,
                error: "Rate limit exceeded"
            } satisfies ErrorResponse);
        }

        return next();
    };
}