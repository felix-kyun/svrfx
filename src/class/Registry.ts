import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Express, Request, Response } from "express";
import { Project } from "@/class/Project";
import { logger } from "@/log/log";
import { root } from "@/utils/root";
import { Context } from "./Context";
import { LazyFn } from "./LazyFn";

export class Registry {
    constructor(private app: Express) {}

    public async scan(directory: string) {
        const path = resolve(join(root(), directory));
        const files = await readdir(path, {
            withFileTypes: true,
        });
        const directories = files
            .filter((f) => f.isDirectory())
            .map((f) => f.name);

        logger.info(`Found ${directories.length} directories in ${path}`);
        for (const dir of directories) {
            let project: Project;

            // try to load project
            try {
                project = await Project.load(join(path, dir));
                logger.info(`Loaded project: ${project.name}`);
            } catch (error) {
                logger.error(
                    `Failed to load project in ${dir}: ${(error as Error).message}`,
                );
                continue;
            }

            await project.writeIndex();

            project.fn.forEach((fn) => {
                const handler = new LazyFn(project, fn);

                this.app[fn.method](
                    `/${project.name}${fn.route}`,
                    async (req: Request, res: Response) => {
                        const context = Context.from(project, req);
                        await handler.run(context);
                        context.finish(res);

                        logger.debug(
                            `handled ${project.name}:${fn.name} (${fn.method} ${fn.route}) in ${Date.now() - context.meta.startTime}ms`,
                        );
                    },
                );

                logger.debug(
                    `registered ${project.name}:${fn.name} (${fn.method} ${fn.route})`,
                );
            });
        }
    }
}
