import { Command } from "commander";
import { createFx, createGroup, setEnv } from "@/cli/methods";

const program = new Command();

program
    .name("svrfx")
    .description("svrfx cli to create and manage functions")
    .version("0.0.0", "-v, --version", "output the current version");

// svrfx create-group <name>
program
    .command("create-group")
    .alias("cg")
    .description("Create a new function group")
    .argument("<name>", "Name of the function group")
    .action(createGroup);

program
    .command("env")
    .description("Create or change environment variables")
    .argument("<key>", "Environment variable key")
    .argument("<value>", "Environment variable value")
    .action(setEnv);

program.command("create").description("Create a new function").action(createFx);

program.parse(process.argv);
