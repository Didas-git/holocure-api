import { Color, colorConsole } from "colours.js";

import { apiUserModel } from "../database";
import { hashApiKey } from "./hashing";

import type { RequestHandler, Response } from "express";

import type { ErrorResponse } from "../typings/shared";

export const LoggerMiddleware: RequestHandler = (req, res, next) => {
    const start = Date.now();
    res.on("finish", function (this: Response) {
        const time = Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeStyle: "medium" }).format().replace(",", " -");
        // eslint-disable-next-line max-len
        logger.print(`[API] ${time} |${colorConsole.uniform(` ${colorConsole.uniform(this.statusCode.toString(), Color.fromHex("#101010"))} `, this.statusCode === 200 || this.statusCode === 202 || this.statusCode === 304 ? Color.fromHex("#4bfc42") : Color.fromHex("#fc330f"), true)}| ${Date.now() - start}ms | ${req.socket.remoteAddress} |${colorConsole.uniform(` ${req.method} `, Color.fromHex("#243aff"), true)} "${req.originalUrl}"`);
    });
    next();
};

export const AuthMiddleWare: RequestHandler = async (req, res, next) => {
    if (req.url === "/") return next();

    const apiKey = req.get("X-API-Key");

    if (typeof apiKey === "undefined") {
        return res.status(401).json({
            code: 401,
            error: "An api key was not given"
        } satisfies ErrorResponse);
    }

    const hashedKey = hashApiKey(apiKey);

    const user = await apiUserModel.findApiKey(hashedKey);

    // if (typeof user === "undefined") {
    //     return res.status(401).json({
    //         code: 401,
    //         error: "The given api key is not valid",
    //         details: "While attempting to fetch the user from the database we did not find one that corresponds to the given api key"
    //     } satisfies ErrorResponse);
    // }

    if (user.banned) {
        return res.status(401).json({
            code: 401,
            error: "Banned from the api",
            details: "The current user has been banned from using the api"
        } satisfies ErrorResponse);
    }

    if (!user.isAdministrator) {
        if (req.method === "GET" && user.permissions.read) return next();
        if (req.method !== "GET" && user.permissions.write) return next();

        return res.status(401).json({
            code: 401,
            error: "Invalid permissions",
            details: "The current user does not have any granted permissions, please contact an administrator"
        } satisfies ErrorResponse);
    }

    next();
};