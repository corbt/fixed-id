const { MerkleTree } = require("merkletreejs");
const { initialize } = require("zokrates-js/node");
const fs = require("fs");
const path = require("path");

const poseidon = require("circomlib/src/poseidon");

// Conversion/serialization helpers

const hexToBigInt = (hex) => BigInt("0x" + hex);
const bigIntToHex = (bigInt) => {
  let str = bigInt.toString(16);
  if (str.length % 2 !== 0) str = "0" + str;
  return str;
};
const bufferToBigInt = (buffer) => hexToBigInt(buffer.toString("hex"));
const bigIntToBuffer = (bigInt) => Buffer.from(bigIntToHex(bigInt), "hex");
const bufferToZok32 = (buffer) =>
  buffer
    .toString("hex")
    .split(/(.{8})/)
    .filter((c) => c.length > 0)
    .map((chunk) => parseInt(chunk, 16).toString());
const bufferToZokField = (buffer) => "0x" + bufferToBigInt(buffer).toString(16);

// Adapt the poseidon hash function to work with `merkletreejs`.
const treePoseidon = (input) => {
  const lhs = input.slice(0, input.length / 2);
  const rhs = input.slice(input.length / 2, input.length);
  return bigIntToBuffer(poseidon([bufferToBigInt(lhs), bufferToBigInt(rhs)]));
};

const hashFn = treePoseidon;

const leaves = [1, 2, 3, 4].map((x) => bigIntToBuffer(poseidon([x])));
const tree = new MerkleTree(leaves, hashFn);

console.log(tree.toString());

async function main() {
  const zok = await initialize();

  const source = (await fs.promises.readFile(path.join(__dirname, "../proof.zok"))).toString();
  const artifacts = zok.compile(source);

  const leaf = leaves[0];
  const merkleProof = tree.getProof(leaf);

  const { witness, output } = zok.computeWitness(artifacts, [
    bufferToZokField(tree.getRoot()),
    bufferToZokField(leaf),
    merkleProof.map((step) => ({
      isRightNode: step.direction === "right",
      otherDigest: bufferToZokField(step.data),
    })),
  ]);

  console.log(output);
  console.log("Merkle proof valid");
}

main().catch(console.error);
