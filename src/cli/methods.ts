import chalk from "chalk";
import ora from "ora";
import { FxGroup } from "@/class/FxGroup";

export async function createGroup(name: string) {
    const spinner = ora(`Creating group ${chalk.cyan.bold(name)}`).start();

    try {
        const group = await FxGroup.create(process.cwd(), name);
        await group.save();
    } catch (error: unknown) {
        spinner.fail(
            `Failed to create group: ${chalk.red.bold((error as Error).message)}`,
        );
        process.exit(1);
    }

    spinner.succeed(`Group ${chalk.cyan.bold(name)} created successfully`);
}
