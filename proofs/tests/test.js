const { MerkleTree } = require("merkletreejs");
const { initialize } = require("zokrates-js/node");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const hashFn = (input) => crypto.createHash("sha256").update(Buffer.from(input, "hex")).digest();

const leaves = ["a", "b", "c", "d"].map((x) => hashFn(Buffer.from(x).toString("hex")));
const tree = new MerkleTree(leaves, hashFn);

// Takes a NodeJS buffer and splits it into an array of N strings each
// representing a 32-byte unsigned int, which is the format Zokrates seems
// happiest with.
const bufferToZok32 = (buffer) =>
  buffer
    .toString("hex")
    .split(/(.{8})/)
    .filter((c) => c.length > 0)
    .map((chunk) => parseInt(chunk, 16).toString());

async function main() {
  const zok = await initialize();

  const source = (await fs.promises.readFile(path.join(__dirname, "../proof.zok"))).toString();
  const artifacts = zok.compile(source);

  const leaf = leaves[0];
  const merkleProof = tree.getProof(leaf);

  const { witness, output } = zok.computeWitness(artifacts, [
    bufferToZok32(tree.getRoot()),
    bufferToZok32(leaf),
    merkleProof.map((step) => ({
      isRightNode: step.direction === "right",
      otherDigest: bufferToZok32(step.data),
    })),
  ]);

  console.log("Merkle proof valid");
}

main().catch(console.error);
