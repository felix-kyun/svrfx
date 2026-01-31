import * as z from "zod";
import type { FxConfig } from "@/types/FxConfig";
import type { IManifest } from "@/types/Manifest";

export const fxConfigSchema = z.object({
    file: z.string().default("handler.js"),
    function: z.string().default("handler"),
    route: z.string(),
    method: z.enum(["get", "post"]).default("get"),
    sandbox: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const manifestSchema = z.object({
    name: z.string(),
    env: z.record(z.string(), z.string()),
    fx: z.array(fxConfigSchema),
});

export const _test_config = {} as FxConfig satisfies z.infer<
    typeof fxConfigSchema
>;
export const _test_manifest = {} as IManifest satisfies z.infer<
    typeof manifestSchema
>;
