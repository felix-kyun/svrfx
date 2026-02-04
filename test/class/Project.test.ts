import { rm } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { Project } from "@/class/Project";
import { root } from "@/utils/root";

const resources = join(root(), "test/resources/");

describe("Project class", () => {
    it("should create a new group with defaults", async () => {
        const group = await Project.create(resources, "new_group");

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
        const group = await Project.create(resources, "new_group");
        await group.save();

        const loadedGroup = await Project.load(join(resources, "new_group"));

        expect(loadedGroup).toEqual(group);
    });

    it("should throw an error when trying to create a group whose folder already exists", async () => {
        const group = await Project.create(resources, "new_group");
        await group.save();

        await expect(
            Project.create(resources, "new_group"),
        ).rejects.toThrowError();
    });

    it("should throw when trying to save to an invalid path", async () => {
        const group = await Project.create(
            "/invalid/path/that/does/not/exist",
            "bad_group",
        );

        await expect(group.save()).rejects.toThrowError();
    });
});
