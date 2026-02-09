import type { IFn } from "@/types/IFn";

export interface IManifest {
    name: string;
    env: Record<string, string>;
    fn: Array<IFn>;
}
