import { useProject } from "../../project.js";
import { Program } from "../program.js";
import { createSpinner } from "../spinner.js";
import fs from "fs/promises";
import path from "path";
import { SiteEnv } from "../../site-env.js";
import { spawnSync } from "child_process";

export const env = (program: Program) =>
  program.command(
    "env <command>",
    "Load environment variables and start your frontend",
    (yargs) =>
      yargs
        .positional("command", {
          type: "string",
          describe: "The command to start your frontend",
          demandOption: true,
        })
        .example(
          `sst env "next dev"`,
          "Start Next.js with your environment variables"
        )
        .example(
          `sst env "vite dev"`,
          "Start Vite with your environment variables"
        ),
    async (args) => {
      const project = useProject();

      let spinner: ReturnType<typeof createSpinner> | undefined;
      while (true) {
        const exists = await fs
          .access(SiteEnv.valuesFile())
          .then(() => true)
          .catch(() => false);
        if (!exists) {
          spinner = createSpinner("Waiting for SST to start").start();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        spinner?.succeed();

        const sites = await SiteEnv.values();
        const env = sites[process.cwd()] || {};

        const result = spawnSync(args.command, {
          env: {
            ...process.env,
            ...env,
          },
          stdio: "inherit",
          shell: process.env.SHELL || true,
        });
        process.exitCode = result.status || undefined;

        break;
      }
    }
  );
