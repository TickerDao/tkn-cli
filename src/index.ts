#! /usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as figlet from "figlet";

import { runGenerate } from "./generate/merkle";
import { runUploadIPFS } from "./upload/ipfs";
import { runDownloadIPFS } from "./download/ipfs";
import { runFetch } from "./fetch/fetch";
import { runValidate } from "./validate/validate";

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
  .action((options) => {
    runGenerate(options.file);
  })
  .addHelpText(
    "after",
    `
  Examples:
    $ tkn gen -f ./data/dataset1.json`
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
    $ export PINATA_SECRET_API_KEY="..."
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

// fetch: fetch the values and proofs for fields
program
  .command("fetch")
  .description("fetch the values and proofs for fields")
  .option("-t, --token <token symbol>", "Token Symbol", "")
  .option("-d, --data-field <data field>", "Data Field", "")
  .option("-f, --file <path>", "path of the dataset", "")
  .option("-s, --save <path>", "path to save field values and proofs", "")
  .action((options) => {
    runFetch(options.token, options.dataField, options.file, options.save);
  })
  .addHelpText(
    "after",
    `
    Examples:
      $ tkn fetch --token DAI --field token_address --file ./data/dataset1.json
      $ tkn fetch --token DAI --file ./data/dataset1.json
      $ tkn fetch --token DAI --field token_address --file ./data/dataset1.json --save ./data/proofs/dai-proof1.json`
  );

// validate: validate the given value(s) and proof(s) of fields against a merkle root value
program
  .command("validate")
  .description(
    "validate the values and proofs for fields against a given merkle root value"
  )
  .option("-f, --file <path>", "path of the proof file", "")
  .option("-r, --root <value>", "merkle root value", "")
  .action((options) => {
    runValidate(options.file, options.root);
  })
  .addHelpText(
    "after",
    `
    Examples:
      $ tkn validate --file ./data/dai-proofs.json --root 0x00912eb6bc80ceaf643e95ff1558f5dd6d93eeabf0913f5e65d181970ad57bf5
      $ tkn validate --file ./data/dai-website-proof.json --root 0x00912eb6bc80ceaf643e95ff1558f5dd6d93eeabf0913f5e65d181970ad57bf5`
  );

program.parse(process.argv);
