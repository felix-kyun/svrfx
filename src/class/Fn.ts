import { fnSchema } from "@/schema/manifestSchema";
import type { IFn } from "@/types/IFn";

export class Fn implements IFn {
    constructor(
        public name: string,
        public route: string = "/",
        public method: "get" | "post" = "get",
        public sandbox: 0 | 1 | 2 | 3 = 0,
    ) {}

    static from(fn: IFn): Fn {
        return new Fn(fn.name, fn.route, fn.method, fn.sandbox);
    }

    static fromObject(obj: object): Fn {
        const fn = fnSchema.safeParse(obj);
        if (!fn.success) {
            console.error(fn.error);
            throw new Error("Invalid Fn configuration");
        }

        return Fn.from(fn.data);
    }

    toJSON(): IFn {
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
