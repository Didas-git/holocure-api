import { Color, colorConsole } from "colours.js";

import type { RequestHandler, Response } from "express";

export const LoggerMiddleware: RequestHandler = (req, res, next) => {
    const start = Date.now();
    res.on("finish", function (this: Response) {
        const time = Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeStyle: "medium" }).format().replace(",", " -");
        // eslint-disable-next-line max-len
        logger.print(`[API] ${time} |${colorConsole.uniform(` ${colorConsole.uniform(this.statusCode.toString(), Color.fromHex("#101010"))} `, this.statusCode === 200 || this.statusCode === 202 || this.statusCode === 304 ? Color.fromHex("#4bfc42") : Color.fromHex("#fc330f"), true)}| ${Date.now() - start}ms | ${req.socket.remoteAddress} |${colorConsole.uniform(` ${req.method} `, Color.fromHex("#243aff"), true)} "${req.originalUrl}"`);
    });
    next();
};