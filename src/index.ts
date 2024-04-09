#! /usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as figlet from "figlet";

import { runGenerate } from "./generate/merkle";

const program = new Command();

console.log(figlet.textSync("TKN CLI"));

program
  .version("1.0.0")
  .description("TKN CLI")
  .option(
    "-g, --generate  [dataset path]",
    "generate merkle root and proofs from data file"
  )
  .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

if (options.generate) {
  const filepath =
    typeof options.generate === "string" ? options.generate : __dirname;
  runGenerate(filepath);
}
