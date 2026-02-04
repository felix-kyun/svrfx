import { confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import logSymbols from "log-symbols";
import ora from "ora";
import { Project } from "@/class/Project";

export async function createGroup(name: string) {
    const spinner = ora(`Creating group ${chalk.cyan.bold(name)}`).start();

    try {
        const group = await Project.create(process.cwd(), name);
        await group.save();
    } catch (error: unknown) {
        spinner.fail(`${chalk.red.bold((error as Error).message)}`).stop();
        process.exit(1);
    }

    spinner
        .succeed(`Group ${chalk.cyan.bold(name)} created successfully`)
        .stop();
}

export async function setEnv(key: string, value: string) {
    const spinner = ora(`Loading Group`).start();
    try {
        const group = await Project.load(process.cwd());
        group.setEnv(key, value);
        await group.save();
    } catch (error: unknown) {
        spinner.fail(`${chalk.red.bold((error as Error).message)}`).stop();
        process.exit(1);
    }

    spinner
        .succeed(
            `Environment variable ${chalk.cyan.bold(key)} set successfully`,
        )
        .stop();
}

export async function listFn() {}

export async function deleteFn() {}

export async function createFn() {
    const spinner = ora("Loading group").start();
    let group: Project;

    try {
        group = await Project.load(process.cwd());
    } catch (error: unknown) {
        spinner.fail(`${chalk.red.bold((error as Error).message)}`).stop();
        process.exit(1);
    }

    spinner.succeed("Group loaded successfully").stop();

    const name = await input({
        message: "Function name",
        required: true,
    });

    const route = await input({
        message: "Function route",
        default: `/${name}`,
        required: true,
    });

    const method = await select({
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

    const sandbox = await select({
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
        console.log(
            logSymbols.warning,
            chalk.yellow.bold(
                ` Function with the same name, route and method already exists.`,
            ),
        );

        const proceed = await confirm({
            message: "Do you want to proceed anyway?",
            default: false,
        });

        if (!proceed) {
            console.log(chalk.red.bold("Aborting function creation."));
            process.exit(0);
        }
    }

    spinner.text = `Creating function ${chalk.cyan.bold(name)}`;

    try {
        group.addFn({
            name,
            route,
            method: method as "get" | "post",
            sandbox: sandbox as 0 | 1 | 2 | 3,
        });
        await group.save();
        spinner
            .succeed(`Function ${chalk.cyan.bold(name)} created successfully`)
            .stop();
    } catch (error: unknown) {
        spinner.fail(`${chalk.red.bold((error as Error).message)}`).stop();
        process.exit(1);
    }
}
