import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import path from "path";

interface Dataset {
  [key: string]: {
    [key: string]: string;
  };
}

interface FlattenedDataset {
  [key: string]: string;
}

export async function runGenerate(filepath: string) {
  console.log(`-------------------------`);
  console.log(`Reading dataset from path:`);
  console.log(`${filepath}`);
  // receive file path from function

  // Read and parse the dataset
  const dataFilePath: string = path.resolve(filepath);
  const dataFileContent: string = fs.readFileSync(dataFilePath, "utf8");
  const dataset: Dataset = JSON.parse(dataFileContent).dataset;

  // Combine the ticker symbol and fields into one single key for each field
  const flattenedDataset: FlattenedDataset = {};
  for (const [key, value] of Object.entries(dataset)) {
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      const combinedKey: string = `${key}&${nestedKey}`;
      flattenedDataset[combinedKey] = nestedValue;
    }
  }

  console.log(`-------------------------`);

  // Convert the flattened dataset to an array
  const flattenedDatasetArray: [string, string][] =
    Object.entries(flattenedDataset);

  // Create a Merkle tree from the dataset
  const tree = StandardMerkleTree.of(flattenedDatasetArray, [
    "string",
    "string",
  ]);

  // update data file with tree info
  const updatedFile = {
    dataset: { ...dataset },
    tree: tree.dump(),
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(updatedFile, null, 2));

  console.log(`Merkle tree updated`);
  console.log(`-------------------------`);

  console.log("Generated Merkle Root:");
  console.log(tree.root);
  console.log(`-------------------------`);
}
