import { access } from "node:fs/promises";

export async function fileExists(path: string): Promise<boolean> {
    try {
        const _f = await access(path);
        return true;
    } catch {
        return false;
    }
}
