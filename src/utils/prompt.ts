import type { Prompt } from "@inquirer/type";
import chalk from "chalk";
import logSymbols from "log-symbols";

export async function prompt<Value, Config>(
    promptFn: Prompt<Value, Config>,
    options: Config,
): ReturnType<Prompt<Value, Config>> {
    try {
        return await promptFn(options);
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "ExitPromptError") {
            console.log(
                chalk.red.bold(
                    `${logSymbols.error} Cancelled by user. Exiting.`,
                ),
            );
            process.exit(0);
        } else throw error;
    }
}
