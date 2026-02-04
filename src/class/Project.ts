import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { manifestSchema } from "@/schema/manifestSchema";
import type { IFn } from "@/types/IFn";
import type { IManifest } from "@/types/Manifest";
import { fileExists } from "@/utils/fileExists";

export class Project {
    private constructor(
        private readonly path: string,
        public readonly name: string,
        public readonly fx: Array<IFn>,
        public readonly env: Record<string, string>,
    ) {}

    // load an existing Project
    static async load(root: string) {
        const path = resolve(root);
        await access(path);

        let fileContent: string;
        try {
            await access(join(path, "manifest.json"));
            fileContent = await readFile(join(path, "manifest.json"), "utf8");
        } catch {
            throw new Error("Unable to read manifest, Does it exist?");
        }

        let manifest: IManifest;
        try {
            const obj = JSON.parse(fileContent);
            manifest = manifestSchema.parse(obj);
        } catch {
            throw new Error("Unable to parse manifest, please fix it.");
        }

        return new Project(path, manifest.name, manifest.fx, manifest.env);
    }

    static async create(rootDirectory: string, name: string) {
        const path = join(resolve(rootDirectory), name);

        if (await fileExists(path)) {
            throw new Error("Directory already exists");
        }

        return new Project(path, name, [], {});
    }

    setEnv(key: string, value: string) {
        this.env[key] = value;
    }

    addFn(fx: IFn) {
        const existing = this.fx.findIndex(
            (f) =>
                f.name === fx.name &&
                f.route === fx.route &&
                f.method === fx.method,
        );

        if (existing !== -1) {
            this.fx[existing] = { ...this.fx[existing], ...fx };
        } else this.fx.push(fx);
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
