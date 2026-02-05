import { writeFile } from "node:fs/promises";
import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { Project } from "@/class/Project";
import { fail, warn } from "@/cli/log";
import type { IFn } from "@/types/IFn";
import { prompt } from "@/utils/prompt";
import { template } from "./template";

export async function createFn() {
    const spinner = ora("Loading group").start();

    let group: Project;
    try {
        group = await Project.load(process.cwd());
    } catch (error: unknown) {
        spinner.fail(chalk.red.bold((error as Error).message));
        process.exit(1);
    }

    spinner.succeed("Group loaded successfully").stop();

    const name = await prompt(input, {
        message: "Function name",
        required: true,
    });

    const route = await prompt(input, {
        message: "Function route",
        default: `/${name}`,
        required: true,
    });

    const method = await prompt(select, {
        message: "Function method",
        choices: [
            {
                name: "GET",
                value: "get",
            },
            {
                name: "POST",
                value: "post",
            },
        ],
    });

    const sandbox = await prompt(select, {
        message: "Sandboxing level",
        choices: [
            {
                name: "Disable",
                value: 0,
                description: "Directly loaded using require",
            },
            {
                name: "Service Workers",
                value: 1,
                description: "Loaded using service workers",
            },
            {
                name: "Child Process",
                value: 2,
                description: "Loaded using child processes",
            },
            {
                name: "Containers (Not implemented)",
                value: 3,
                description: "Loaded using containers",
            },
        ],
    });

    const existing = group.fx.find(
        (fx) => fx.name === name && fx.route === route && fx.method === method,
    );
    if (existing) {
        warn(`Function with the same name, route and method already exists.`);

        const proceed = await prompt(confirm, {
            message: "Do you want to proceed anyway?",
            default: false,
        });

        if (!proceed) {
            fail("Function creation aborted");
            process.exit(0);
        }
    }

    spinner.text = `Creating function ${chalk.cyan.bold(name)}`;
    spinner.start();
    const fn: IFn = {
        name,
        route,
        method: method as "get" | "post",
        sandbox: sandbox as 0 | 1 | 2 | 3,
    };

    try {
        group.addFn(fn);
        await group.save();
    } catch (error: unknown) {
        spinner.fail(chalk.red.bold((error as Error).message)).stop();
        process.exit(1);
    }

    spinner.text = `Creating file for function ${chalk.cyan.bold(name)}`;
    spinner.start();

    try {
        await writeFile(`${process.cwd()}/${name}.js`, template(fn));
    } catch (error: unknown) {
        spinner.fail(chalk.red.bold((error as Error).message));
        process.exit(1);
    }

    spinner.succeed(`Function ${chalk.cyan.bold(name)} created successfully`);
}
