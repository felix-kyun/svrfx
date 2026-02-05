import chalk from "chalk";
import logSymbols from "log-symbols";

export function warn(msg: string): void {
    console.warn(chalk.bold.yellow(`${logSymbols.warning} ${msg}`));
}

export function fail(msg: string): void {
    console.error(chalk.bold.red(`${logSymbols.error} ${msg}`));
}

export function success(msg: string): void {
    console.log(chalk.bold.green(`${logSymbols.success} ${msg}`));
}
