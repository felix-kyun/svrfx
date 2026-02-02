import { Command } from "commander";
import { createGroup } from "./methods";

const program = new Command();

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
    .action(createGroup);

program.parse(process.argv);
