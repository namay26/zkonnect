const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const EC = require("elliptic").ec;
const { exec, execSync } = require("child_process");
const { log } = require("console");
const ec = new EC("secp256k1");
const port = 3000;
app.use(express.json());

function preparePrivateKeyHex(privateKeyHex, n, k) {
  const privateKeyInt = BigInt("0x" + privateKeyHex);
  const mask = (BigInt(1) << BigInt(n)) - BigInt(1);
  const privkeyChunks = [];
  for (let i = 0; i < k; i++) {
    const chunk = (privateKeyInt >> BigInt(i * n)) & mask;
    privkeyChunks.push(chunk.toString());
  }
  const inputData = {
    privkey: privkeyChunks,
  };

  return JSON.stringify(inputData, null, 4);
}
async function get_public_key(privateKey) {}

//signup : geta new private key
app.get("/generate_key", async (req, res) => {
  let public_key = "";
  try {
    const key = ec.genKeyPair();
    const privateKey = key.getPrivate("hex");

    const inputJson = preparePrivateKeyHex(privateKey, 64, 4);
    const hex = Math.floor(Math.random() * 5000000).toString(16);

    await fs.writeFile(`./inputs/${hex}.json`, inputJson);

    const command = `cd ../zk-auth/scripts/pubkeygen && ./run_pubkeygen.sh ${hex}.json ${hex}`;
    const myShellScript = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send(`stderr: ${stderr}`);
      }
      const lines = stdout.trim().split("\n");
      public_key = lines[lines.length - 1];
    });
    myShellScript.stdout.on("data", async (data) => {
      console.log(data.toString());
      if (data.includes("Public")) {
        public_key = data.split(" ")[3].split("\n")[0];
        await fs.rm(`./inputs/${hex}.json`);
        await fs.rm(`../zk-auth/build/pubkeygen/outputs/proof_${hex}.json`);
        await fs.rm(`../zk-auth/build/pubkeygen/outputs/witness_${hex}.wtns`);
        await fs.rm(`../zk-auth/build/pubkeygen/outputs/public_${hex}.json`);

        res.json({ privateKey, public_key });
      }
    });

    myShellScript.stderr.on("data", (data) => {
      console.error(data);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(`Error: ${error}`);
  }
});

//login: get a public from a private key
app.post("/get_public_key", async (req, res) => {
  const { privateKey } = req.body;
  console.log(privateKey);
  const inputJson = preparePrivateKeyHex(privateKey, 64, 4);
  const hex = Math.floor(Math.random() * 5000000).toString(16);

  await fs.writeFile(`./inputs/${hex}.json`, inputJson);

  const command = `cd ../zk-auth/scripts/pubkeygen && ./run_pubkeygen.sh ${hex}.json ${hex}`;
  const myShellScript = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`stderr: ${stderr}`);
    }
    const lines = stdout.trim().split("\n");
    public_key = lines[lines.length - 1];
  });
  myShellScript.stdout.on("data", async (data) => {
    console.log(data.toString());
    if (data.includes("Public")) {
      public_key = data.split(" ")[3].split("\n")[0];
      await fs.rm(`./inputs/${hex}.json`);
      await fs.rm(`../zk-auth/build/pubkeygen/outputs/proof_${hex}.json`);
      await fs.rm(`../zk-auth/build/pubkeygen/outputs/witness_${hex}.wtns`);
      await fs.rm(`../zk-auth/build/pubkeygen/outputs/public_${hex}.json`);

      res.json({ privateKey, public_key });
    }
  });

  myShellScript.stderr.on("data", (data) => {
    console.error(data);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
