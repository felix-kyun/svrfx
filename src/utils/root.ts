import { resolve } from "node:path";

// const rootPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../");
const rootPath = resolve(__dirname, "../../");
export function root(): string {
    return rootPath;
}
