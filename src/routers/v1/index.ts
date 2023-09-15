import { Router } from "express";

import { characterModel, itemModel, skillModel, weaponModel } from "../../database";
import { AuthMiddleWare } from "../../middleware";

import type { ErrorResponse, VersionInfo } from "../../typings/shared";

export const router: Router = Router();

router.use(AuthMiddleWare);

router.get("/", (_, res) => {
    res.status(200).json({
        version: "1.0.0",
        deprecated: false,
        availableInformation: [
            "Weapon",
            "Item",
            "Character"
        ]
    } satisfies VersionInfo);
});

router.get("/weapon/:name", async (req, res) => {
    const { name } = req.params;
    const weapon = await weaponModel.findByName(name);

    if (typeof weapon === "undefined") {
        return res.status(404).json({
            code: 404,
            error: "No data found",
            details: "No weapon with that name was found on the database"
        } satisfies ErrorResponse);
    }

    return res.status(200).json(weapon);
});

router.get("/item/:name", async (req, res) => {
    const { name } = req.params;
    const item = await itemModel.findByName(name);

    if (typeof item === "undefined") {
        return res.status(404).json({
            code: 404,
            error: "No data found",
            details: "No item with that name was found on the database"
        } satisfies ErrorResponse);
    }

    return res.status(200).json(item);
});

router.get("/skill/:name", async (req, res) => {
    const { name } = req.params;
    const skill = await skillModel.findByName(name);

    if (typeof skill === "undefined") {
        return res.status(404).json({
            code: 404,
            error: "No data found",
            details: "No skill with that name was found on the database"
        } satisfies ErrorResponse);
    }

    return res.status(200).json(skill);
});

router.get("/character/:name", async (req, res) => {
    const { name } = req.params;
    const character = await characterModel.findByName(name);

    if (typeof character === "undefined") {
        return res.status(404).json({
            code: 404,
            error: "No data found",
            details: "No character with that name was found on the database"
        } satisfies ErrorResponse);
    }

    return res.status(200).json(character);
});