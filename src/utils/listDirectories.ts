import { readdir } from "node:fs/promises";

export async function listDirectories(path: string): Promise<Array<string>> {
    const entries = await readdir(path, {
        withFileTypes: true,
    });

    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}
