import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import path from "path";

interface Dataset {
  [key: string]: {
    [key: string]: string;
  };
}

export async function runFetch(
  token: string,
  dataField: string,
  filepath: string,
  save: string
) {
  console.log(`-------------------------`);
  console.log(`Reading dataset and tree from path:`);
  console.log(`${filepath}`);

  // Read and parse the dataset
  const dataFilePath: string = path.resolve(filepath);
  const dataFileContent: string = fs.readFileSync(dataFilePath, "utf8");
  const dataset: Dataset = JSON.parse(dataFileContent).dataset;

  // Read and parse the tree
  const tree = StandardMerkleTree.load(JSON.parse(dataFileContent).tree);
  console.log(`-------------------------`);

  // fetch all fields of the given token
  if (!token) {
    console.log("Please provide token symbol");
    return;
  }

  if (!dataset[token]) {
    console.log(`Token ${token} does not exist in dataset`);
    return;
  }

  console.log(`Reading data for token: ${token}`);
  const tokenData = dataset[token];
  console.log(`-------------------------`);

  const merkleRoot = tree.root;
  console.log(`Merkle Root: ${merkleRoot}`);

  let proofs = Object.entries(tokenData).reduce((acc, [key, value]) => {
    const combinedKey = `${token}&${key}`;
    acc[combinedKey] = {
      value: value,
      proof: tree.getProof([`${token}&${key}`, value]),
    };

    return acc;
  }, {} as { [key: string]: { value: string; proof: string[] } });

  if (dataField) {
    let filteredProofs = {
      [`${token}&${dataField}`]: proofs[`${token}&${dataField}`],
    };
    proofs = filteredProofs;
  }
  console.log(proofs);
  console.log(`-------------------------`);

  if (!save) {
    console.log("Skipping save");
    return;
  }

  if (fs.existsSync(save)) {
    console.log(
      `File ${save} already exists. Please choose a different save path.`
    );
    return;
  }

  console.log(`Saving proofs to file: ${save}`);

  const proofsFile = {
    root: merkleRoot,
    fields: proofs,
  };

  fs.writeFileSync(save, JSON.stringify(proofsFile));
  console.log(`-------------------------`);
}
