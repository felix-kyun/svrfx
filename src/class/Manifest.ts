import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { manifestSchema } from "@/schema/manifestSchema";
import type { FxConfig } from "@/types/FxConfig";
import type { IManifest } from "@/types/Manifest";

export class Manifest {
    public path: string;
    public name: string;
    public fx: Array<FxConfig>;
    public env: Record<string, string>;

    constructor(path: string) {
        this.path = resolve(path);
    }

    async load() {
        const rawManifest = JSON.parse(await readFile(this.path));
        const parse = manifestSchema.safeParse(rawManifest);

        if (!parse.success) {
            console.error(parse.error);
            throw new Error("unable to parse manifest");
        }

        const manifest: IManifest = parse.data;

        this.name = manifest.name;
        this.env = manifest.env;
        this.fx = manifest.fx;
    }

    async save() {
        const rawManifest = JSON.strinify(
            {
                name,
                env,
                fx,
            },
            null,
            4,
        );

        await writeFile(this.path, rawManifest);
    }
}
