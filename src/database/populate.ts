import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createApiKey } from "../utils/hashing";
import { apiUserModel } from ".";

export async function populateTestUsers(): Promise<void> {
    const possibleTest = await apiUserModel.get("TEST");
    if (possibleTest !== null) return;

    const { key, hashedKey } = createApiKey();

    await writeFile(join(__dirname, "../../.key"), key);

    await apiUserModel.createAndSave({
        $id: "TEST",
        name: "TEST",
        apiKey: hashedKey,
        isAdministrator: true,
        permissions: {
            write: true,
            read: true
        }
    });
}