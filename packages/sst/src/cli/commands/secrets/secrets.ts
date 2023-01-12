import { Program } from "../../program.js";
import { get } from "./get.js";
import { list } from "./list.js";
import { remove } from "./remove.js";
import { set } from "./set.js";

export function secrets(program: Program) {
  program.command("secrets", "Manage the secrets in your app", (yargs) => {
    yargs.demandCommand(1);
    get(yargs);
    set(yargs);
    list(yargs);
    remove(yargs);

    return yargs;
  });
}
