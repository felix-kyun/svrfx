import { rm, unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FxGroup } from "@/class/FxGroup";
import { root } from "@/utils/root";

const resources = join(root(), "test/resources/");

describe("FxGroup class", () => {
    it("should create a new group with defaults", async () => {
        const group = await FxGroup.create(resources, "new_group");

        expect(group.name).toBe("new_group");
        expect(group.fx).toEqual([]);
        expect(group.env).toEqual({});
    });

    afterEach(async () => {
        await rm(join(resources, "new_group"), {
            recursive: true,
            force: true,
        });
    });

    it("should be able to save and load a group", async () => {
        const group = await FxGroup.create(resources, "new_group");
        await group.save();

        const loadedGroup = await FxGroup.load(join(resources, "new_group"));

        expect(loadedGroup).toEqual(group);
    });

    it("should throw an error when trying to create a group whose folder already exists", async () => {
        const group = await FxGroup.create(resources, "new_group");
        await group.save();

        await expect(
            FxGroup.create(resources, "new_group"),
        ).rejects.toThrowError();
    });

    it("should throw when trying to save to an invalid path", async () => {
        const group = await FxGroup.create(
            "/invalid/path/that/does/not/exist",
            "bad_group",
        );

        await expect(group.save()).rejects.toThrowError();
    });
});
