import { fxSchema } from "@/schema/manifestSchema";
import type { IFx } from "@/types/IFx";

export class Fx implements IFx {
    constructor(
        public name: string,
        public route: string = "/",
        public method: "get" | "post" = "get",
        public sandbox: 0 | 1 | 2 | 3 = 0,
    ) {}

    static from(fx: IFx): Fx {
        return new Fx(fx.name, fx.route, fx.method, fx.sandbox);
    }

    static fromObject(obj: object): Fx {
        const fx = fxSchema.safeParse(obj);
        if (!fx.success) {
            console.error(fx.error);
            throw new Error("Invalid Fx configuration");
        }

        return Fx.from(fx.data);
    }

    toJSON(): IFx {
        return {
            name: this.name,
            route: this.route,
            method: this.method,
            sandbox: this.sandbox,
        };
    }

    setMethod(method: string) {
        method = method.toLowerCase();
        if (["get", "post"].includes(method)) {
            this.method = method as "get" | "post";
        } else throw new Error("Invalid method. Use 'get' or 'post'.");
    }

    setSandbox(level: number) {
        if ([0, 1, 2, 3].includes(level)) {
            this.sandbox = level as 0 | 1 | 2 | 3;
        } else throw new Error("Invalid sandbox level. Use 0, 1, 2, or 3.");
    }
}
