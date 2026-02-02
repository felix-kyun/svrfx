import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { FxGroup } from "@/class/FxGroup";

export const program = new Command();

program
    .name("svrfx")
    .description("svrfx cli to create and manage functions")
    .version("0.0.0");

// svrfx create-group <name>
program
    .command("create-group")
    .alias("cg")
    .description("Create a new function group")
    .argument("<name>", "Name of the function group")
    .action(async (name: string) => {
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
    });
