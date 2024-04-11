import fs from "fs";
import axios from "axios";

export async function runDownloadIPFS(contenthash: string, filepath: string) {
  if (fs.existsSync(filepath)) {
    console.log(`File already exists at ${filepath}. Skipping download.`);
    return;
  }

  const url = `https://cloudflare-ipfs.com/ipfs/${contenthash}`;

  console.log(`Downloading file:`);
  console.log(`https://cloudflare-ipfs.com/ipfs/${contenthash}`);
  console.log(`-------------------------`);

  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filepath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);

      console.log(`Downloaded file to ${filepath}`);
      console.log(`-------------------------`);
    });
  } catch (error) {
    console.log("Error downloading the file:", error);
    return;
  }
}
