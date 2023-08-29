import { Router } from "express";

import { AuthMiddleWare } from "../../utils/middleware";

import type { VersionInfo } from "../../typings/shared";

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