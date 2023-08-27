import { client } from "nekdis";

const weaponSchema = client.schema({
    name: "string",
    description: "string",
    /** How often it appears */
    weight: "number",
    notes: "array",
    reference: {
        type: "string",
        optional: true
    },
    /**
     * 0 = Character/Starting Weapon
     * 1 = Basic Weapon
     * 2 = Collab Weapon
     * 3 = Super Collab Weapon
    */
    type: "number",
    /** 0-6 but 1-7 in game (7 = MAX) */
    levels: "array",
    damage: {
        type: "object",
        properties: {
            /** Percentage of damage */
            value: "number",
            rage: {
                type: "tuple",
                /** From - To */
                elements: ["number", "number"]
            }
        }
    },
    attack: {
        type: "object",
        properties: {
            /**
             * 0 = Melee
             * 1 = MultiShot
             * 2 = Ranged
            */
            type: "number",
            time: {
                type: "object",
                properties: {
                    value: "number",
                    inSeconds: "number",
                    /** If it is undefined then its the same as base */
                    minimum: {
                        type: "object",
                        properties: {
                            value: "number",
                            inSeconds: "number"
                        },
                        optional: true
                    }
                }
            },
            count: "number",
            delay: {
                type: "object",
                properties: {
                    value: "number",
                    inSeconds: "number"
                }
            }
        }
    },
    hit: {
        type: "object",
        properties: {
            /** If it is undefined then there is no hit limit */
            limit: {
                type: "number",
                optional: true
            },
            cooldown: {
                type: "object",
                properties: {
                    value: "number",
                    inSeconds: "number"
                }
            }
        }
    },
    area: "number",
    duration: {
        type: "object",
        properties: {
            value: "number",
            inSeconds: "number"
        }
    },
    /** If its 0 then there are no projectiles */
    projectileSpeed: "number",
    /** In Pixels (px) */
    range: "number",
    /** In Pixels (px) */
    radius: "number",
    /** In percentage (%) */
    chance: "number",
    knockback: {
        type: "object",
        properties: {
            duration: {
                type: "object",
                properties: {
                    value: "number",
                    inSeconds: "number"
                }
            },
            speed: "number"
        }
    },
    /**
     * The 2 weapons that make out the collab,
     * if type is not 2 or 3 then it will be empty
    */
    weapons: {
        type: "reference",
        schema: "self"
    }
});

export const weaponModel = client.model("Weapon", weaponSchema);

const itemSchema = client.schema({
    name: "string",
    description: "string",
    /** How often it appears */
    weight: "number",
    notes: "array",
    reference: {
        type: "string",
        optional: true
    },
    /**
     * 0 = Stat
     * 1 = Utility
     * 2 = Healing
    */
    type: "number",
    maxLevel: "number",
    /** 0-(maxLevel-1) but 1-maxLevel in game (7 = MAX) */
    levels: "array",
    /** If you can get a super version of it */
    hasSuperVersion: "boolean",
    /** Will only exist if `hasSuperVersion` is true */
    superLevel: {
        type: "string",
        optional: true
    }
});

export const itemModel = client.model("Item", itemSchema);

const skillSchema = client.schema({
    name: "string",
    /**
     * 0 = Special Skill
     * 1 = Normal Skill
    */
    type: "number",
    /** 0-2 but 1-3 in game */
    levels: "array",
    /** If it is undefined there are no details/notes */
    notes: {
        type: "array",
        optional: true
    }
});

export const skillModel = client.model("Skill", skillSchema);

const characterSchema = client.schema({
    name: "string",
    /** URL for the icon */
    icon: "string",
    /** Hololive generation name */
    group: "string",
    startingWeapon: {
        type: "reference",
        schema: weaponSchema
    },
    /** If nothing changes it is
     * 0 = Special Skill
     * 1-3 = Normal Skills
     * But it can be checked via the `skill.type` property
    */
    skills: {
        type: "reference",
        schema: skillSchema
    },
    hp: "number",
    atk: "number",
    crt: "number",
    /** 1 to 5 (1 = flat) */
    size: "number"
});

export const characterModel = client.model("Character", characterSchema);