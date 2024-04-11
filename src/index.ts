#! /usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as figlet from "figlet";

import { runGenerate } from "./generate/merkle";
import { runUploadIPFS } from "./upload/ipfs";
import { runDownloadIPFS } from "./download/ipfs";

const program = new Command();

console.log(figlet.textSync("TKN CLI"));

program.name("tkn").version("1.0.0").description("TKN CLI");

// generate: generate merkle tree and add to dataset
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
    runGenerate(options.file);
  })
  .addHelpText(
    "after",
    `
  Examples:
    $ tkn gen -f ./data/dataset1.json
    $ tkn generate -i qm...e`
  );

// upload: upload local file to ipfs and return content hash of the file
program
  .command("upload")
  .description("upload dataset file to ipfs")
  .option(
    "-f, --file <path>",
    "Location of the dataset",
    "./data/dataset1.json"
  )
  .action((options) => {
    runUploadIPFS(options.file);
  })
  .addHelpText(
    "after",
    `
  Examples:
    $ export PINATA_API_KEY="..."
    $ export PINATA_API_SECRET="..."
    $ tkn upload -f ./data/dataset1.json`
  );

// download: download a file locally with its ipfs content hash
program
  .command("download")
  .description("download dataset file from ipfs")
  .option(
    "-i, --ipfs <content hash>",
    "Content hash of the dataset",
    "bafkreigr7bx6bxvz7uef5ieq553epgav4yuevpxhxa7fyxdbk2emi3rrtu"
  )
  .option(
    "-f, --file <path>",
    "path to download file",
    "~/Desktop/dataset1.json"
  )
  .action((options) => {
    runDownloadIPFS(options.ipfs, options.file);
  })
  .addHelpText(
    "after",
    `
  Examples:
    $ tkn download -i bafkreigr7bx6bxvz7uef5ieq553epgav4yuevpxhxa7fyxdbk2emi3rrtu -f ~/Desktop/dataset1.json`
  );

program.parse(process.argv);
