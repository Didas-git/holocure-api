import { randomUUID, createHash } from "node:crypto";

export function createApiKey(): { key: string, hashedKey: string } {
    const key = randomUUID().replaceAll("-", "");
    const hashedKey = hashApiKey(key);

    return { key, hashedKey };
}

export function hashApiKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}