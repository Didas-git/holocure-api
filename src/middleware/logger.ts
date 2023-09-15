import { Color, colorConsole } from "colours.js";

import {
    IsSuccessful,
    IsClientError,
    IsServerError,
    IsRedirection
} from "../typings/status-codes";

import type { RequestHandler, Response } from "express";

export const LoggerMiddleware: RequestHandler = (req, res, next) => {
    const start = performance.now();
    res.on("finish", function (this: Response) {
        const end = performance.now();
        const time = Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeStyle: "medium" }).format().replaceAll(",", " -");
        // eslint-disable-next-line max-len
        logger.print(`[API] ${time} |${colorConsole.uniform(` ${colorConsole.uniform(this.statusCode.toString(), Color.fromHex("#101010"))} `, getStatusColor(this.statusCode), true)}| ${(end - start).toFixed(1)}ms | ${req.socket.remoteAddress} |${colorConsole.uniform(` ${req.method} `, Color.fromHex("#243aff"), true)} => "${req.originalUrl}"`);
    });
    next();
};

function getStatusColor(code: number): Color {
    if (IsSuccessful(code) || code === 304) return Color.fromHex("#4bfc42");
    if (IsClientError(code) || IsServerError(code)) return Color.fromHex("#fc330f");
    if (IsRedirection(code)) return Color.fromHex("#f5d225");
    return Color.fromHex("#1fa2ff");
}