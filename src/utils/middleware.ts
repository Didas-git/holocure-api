import { Color, colorConsole } from "colours.js";

import { apiUserModel } from "../database";
import { hashApiKey } from "./hashing";

import {
    IsSuccessful,
    IsClientError,
    IsServerError,
    IsRedirection
} from "../typings/status-codes";

import type { RequestHandler, Response } from "express";

import type { ErrorResponse } from "../typings/shared";

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

export function getStatusColor(code: number): Color {
    if (IsSuccessful(code) || code === 304) return Color.fromHex("#4bfc42");
    if (IsClientError(code) || IsServerError(code)) return Color.fromHex("#fc330f");
    if (IsRedirection(code)) return Color.fromHex("#f5d225");
    return Color.fromHex("#1fa2ff");
}

export const AuthMiddleWare: RequestHandler = async (req, res, next) => {
    if (req.url === "/") return next();

    const apiKey = req.get("X-API-Key");

    if (typeof apiKey === "undefined") {
        return res.status(401).json({
            code: 401,
            error: "No API Key was provided"
        } satisfies ErrorResponse);
    }

    const hashedKey = hashApiKey(apiKey);
    const user = await apiUserModel.findApiKey(hashedKey);

    if (typeof user === "undefined") {
        return res.status(401).json({
            code: 401,
            error: "The given api key is not valid",
            details: "While attempting to fetch the user from the database we did not find one that corresponds to the given api key"
        } satisfies ErrorResponse);
    }

    if (user.banned) {
        return res.status(403).json({
            code: 403,
            error: "Banned from the api",
            details: "The current user has been banned from using the api"
        } satisfies ErrorResponse);
    }

    if (!user.isAdministrator) {
        if (!(req.method === "GET" && user.permissions.read) && !(req.method !== "GET" && user.permissions.write)) {
            return res.status(403).json({
                code: 403,
                error: "Invalid permissions",
                details: "The current user does not have any granted permissions, please contact an administrator"
            } satisfies ErrorResponse);
        }
    }

    // Update user uses
    user.uses += 1;
    // Nekdis does rly need an update method... (maybe 0.15?)
    await apiUserModel.save(user);

    next();
};