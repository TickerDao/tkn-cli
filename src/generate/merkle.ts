import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import path from "path";

interface Dataset {
  [key: string]: string;
}

export async function runGenerate(filepath: string) {
  console.log(`-------------------------`);
  console.log(`Reading dataset from path: ${filepath}`);
  // receive path from function

  // Use the provided filepath to read the dataset
  const datasetFilePath = path.resolve(filepath);
  const datasetContent = fs.readFileSync(datasetFilePath, "utf8");
  const dataset: Dataset = JSON.parse(datasetContent);
  const datasetArray = Object.entries(dataset);

  console.table(dataset);

  console.log(`-------------------------`);
  // Create a Merkle tree from the dataset
  const tree = StandardMerkleTree.of(datasetArray, ["string", "string"]);

  console.log("Merkle Root:", tree.root);

  console.log(`-------------------------`);
  console.log(`Merkle Tree`);
  console.log(tree.render());

  console.log(`-------------------------`);
  console.log(`Merkle Proofs of all data points`);
  for (const [i, v] of tree.entries()) {
    console.log("value:", v);
    console.log("proof:", tree.getProof(i));
  }

  console.log(`-------------------------`);
  console.log(`Verifying proof of data point #3`);
  const proof = tree.getProof(2);
  console.log(`Result:`);
  console.log(
    tree.verify(
      ["USDC&github", "https://github.com/centrehq/centre-tokens"],
      proof
    )
  );

  console.log(`-------------------------`);
  const { dir, name, ext } = path.parse(filepath);
  const outputFilename = `${name}-tree${ext}`;
  const outputPath = path.join(dir, outputFilename);

  fs.writeFileSync(outputPath, JSON.stringify(tree.dump()));
  console.log(`Merkle tree written to file: ${outputPath}`);
}
