import fs from "fs";
import path from "path";
import pinataSDK from "@pinata/sdk";
import prompts from "prompts";

export async function runUploadIPFS(filepath: string) {
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

  if (!pinataApiKey || !pinataSecretApiKey) {
    console.log(
      "Pinata API keys are missing. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables."
    );

    return;
  }

  const pinata = new pinataSDK({
    pinataApiKey,
    pinataSecretApiKey,
  });

  const authRes = await pinata.testAuthentication();
  if (!authRes.authenticated) {
    console.log("Pinata authentication failed");
    return;
  }
  console.log("Pinata authentication successful");
  console.log(`-------------------------`);

  const dataFilePath: string = path.resolve(filepath);
  const readableStreamForFile = fs.createReadStream(dataFilePath);

  const options = {
    pinataMetadata: {
      name: path.basename(filepath),
    },
    pinataOptions: {
      cidVersion: 1,
    },
  };

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: `Are you sure you want to upload: ${filepath}?`,
    initial: false,
  });

  if (!confirm) {
    console.log("Upload canceled.");
    return;
  }

  const uploadRes = await pinata.pinFileToIPFS(
    readableStreamForFile,
    options as any
  );
  console.log("Content Hash:");
  console.log(uploadRes.IpfsHash);
  console.log("View File:");
  console.log(`https://cloudflare-ipfs.com/ipfs/${uploadRes.IpfsHash}`);
  console.log(`-------------------------`);
}
