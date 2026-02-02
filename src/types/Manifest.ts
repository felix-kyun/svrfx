import type { IFx } from "@/types/IFx";

export interface IManifest {
    name: string;
    env: Record<string, string>;
    fx: Array<IFx>;
}
