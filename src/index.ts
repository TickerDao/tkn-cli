#! /usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as figlet from "figlet";

import { runGenerate } from "./generate/merkle";

const program = new Command();

console.log(figlet.textSync("TKN CLI"));

program.name("tkn").version("1.0.0").description("TKN CLI");

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program
  .command("generate")
  .alias("gen")
  .description("generate merkle root and proofs from dataset")
  .option(
    "-f, --file <path>",
    "Location of the dataset",
    "./data/dataset1.json"
  )
  .option("-i, --ipfs <content hash>", "Content Hash of the IPFS file", "...")
  .action((options) => {
    const filepath =
      typeof options.file === "string" ? options.file : __dirname;
    runGenerate(filepath);
  })
  .addHelpText(
    "after",
    `
  Examples:
    $ tkn gen -f ./data/dataset1.json
    $ tkn generate -i qm...e`
  );

program.parse(process.argv);
