import chalk from "chalk";
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
