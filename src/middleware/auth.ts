import { hashApiKey } from "../utils/hashing";
import { apiUserModel } from "../database";

import type { ErrorResponse } from "../typings/shared";
import type { RequestHandler } from "express";

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