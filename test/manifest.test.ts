import { unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { afterAll, beforeEach, describe, expect, it, test } from "vitest";
import { Manifest } from "@/class/Manifest";
import { root } from "@/utils/root";

describe("Manifest Class", () => {
    const manifestFilePath = join(root(), "test/resources/manifest.json");
    const mockManifest = {
        name: "test_group",
        env: {
            mode: "test",
        },
        fx: [
            {
                file: "handler.js",
                function: "handler",
                route: "/",
                method: "get",
                sandbox: 0,
            },
            {
                route: "/hello",
                method: "post",
                sandbox: 1,
            },
        ],
    };

    beforeEach(async () => {
        await writeFile(
            resolve(manifestFilePath),
            JSON.stringify(mockManifest),
        );
    });

    afterAll(async () => {
        await unlink(resolve(manifestFilePath));
    });

    it("should load a manifest file", async () => {
        const manifest = new Manifest(manifestFilePath);
        await manifest.load();

        expect(manifest.name).toBe(mockManifest.name);
    });

    it("should throw an error for invalid path", async () => {
        const manifest = new Manifest(join(root(), "invalid_manifest.json"));

        await expect(() => manifest.load()).rejects.toThrow();
    });
});
