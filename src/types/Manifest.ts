import type { FxConfig } from "@/types/FxConfig";

export interface IManifest {
    name: string;
    env: Record<string, string>;
    fx: Array<FxConfig>;
}
