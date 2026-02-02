import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { root } from "@/utils/root";

describe("Root helper", () => {
    it("should return the correct root path", () => {
        expect(root()).toBe(resolve(join(__dirname, "../../")));
    });
});
