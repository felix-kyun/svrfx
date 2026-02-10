import { join } from "node:path";
import type { Project } from "@/class/Project";
import type { Handler } from "@/types/Handler";
import type { IContext } from "@/types/IContext";
import type { IFn } from "@/types/IFn";
import type { Nullable } from "@/types/Nullable";

export class LazyFn {
    loadedFn: Nullable<Handler> = null;

    constructor(
        private project: Project,
        private fn: IFn,
    ) {}

    private async load() {
        this.loadedFn = require(join(this.project.path, `${this.fn.name}.js`))
            .handler as Handler;
        setTimeout(
            () => {
                this.loadedFn = null;
            },
            1 * 60 * 1000,
        );
    }

    async run(context: IContext) {
        if (!this.loadedFn) this.load();

        await this.loadedFn?.(context);
    }
}
