import * as z from "zod";
import type { IFn } from "@/types/IFn";
import type { IManifest } from "@/types/Manifest";

export const fxSchema = z.object({
    name: z.string(),
    route: z.string(),
    method: z.enum(["get", "post"]).default("get"),
    sandbox: z
        .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
        .default(0),
});

export const manifestSchema = z.object({
    name: z.string(),
    env: z.record(z.string(), z.string()),
    fx: z.array(fxSchema),
});

export const _test_config = {} as IFn satisfies z.infer<typeof fxSchema>;
export const _test_manifest = {} as IManifest satisfies z.infer<
    typeof manifestSchema
>;
