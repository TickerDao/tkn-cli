import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import path from "path";

export async function runValidate(file: string, root: string) {
  console.log(`-------------------------`);

  console.log(`Validating all proofs present in file against root:`);
  console.log("${root}");
  const proofFile = JSON.parse(fs.readFileSync(file, "utf8"));
  const dataFields = proofFile.fields;
  const verificationArray = Object.keys(dataFields).map((key) => ({
    value: [key, dataFields[key].value],
    proof: dataFields[key].proof,
  }));
  console.log(`-------------------------`);

  console.log("Verification Results:");
  const verificationResults = verificationArray.map((item) => ({
    field: item.value[0],
    value: item.value[1],
    validationStatus: StandardMerkleTree.verify(
      root,
      ["string", "string"],
      item.value,
      item.proof
    ),
  }));

  console.table(verificationResults);
  console.log(`-------------------------`);
}
