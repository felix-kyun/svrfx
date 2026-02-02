import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { manifestSchema } from "@/schema/manifestSchema";
import type { FxConfig } from "@/types/FxConfig";
import type { IManifest } from "@/types/Manifest";
import { fileExists } from "@/utils/fileExists";

export class FxGroup {
    private constructor(
        private readonly path: string,
        public readonly name: string,
        public readonly fx: Array<FxConfig>,
        public readonly env: Record<string, string>,
    ) {}

    // load an existing FxGroup
    static async load(root: string) {
        const path = resolve(root);
        await access(path);
        await access(join(path, "manifest.json"));

        const rawManifest = JSON.parse(
            await readFile(join(path, "manifest.json"), "utf8"),
        );
        const parse = manifestSchema.safeParse(rawManifest);
        if (!parse.success) {
            console.error(parse.error);
            throw new Error("unable to parse manifest");
        }

        const manifest: IManifest = parse.data;
        return new FxGroup(path, manifest.name, manifest.fx, manifest.env);
    }

    static async create(rootDirectory: string, name: string) {
        const path = join(resolve(rootDirectory), name);

        if (await fileExists(path)) {
            throw new Error("Directory already exists");
        }

        return new FxGroup(path, name, [], {});
    }

    async save() {
        // create root directory if it doesn't exist
        try {
            await access(this.path);
        } catch {
            await mkdir(this.path);
        }

        // manifest
        const manifest = {
            name: this.name,
            env: this.env,
            fx: this.fx,
        };
        await writeFile(
            join(this.path, "manifest.json"),
            JSON.stringify(manifest, null, 4),
        );
    }
}
