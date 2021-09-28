const { MerkleTree } = require("merkletreejs");
const { initialize } = require("zokrates-js/node");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const hashFn = (input) => crypto.createHash("sha256").update(Buffer.from(input, "hex")).digest();

const leaves = ["a", "b", "c", "d"].map((x) => hashFn(Buffer.from(x).toString("hex")));
const tree = new MerkleTree(leaves, hashFn);
console.log(tree.toString());
const root = tree.getRoot().toString("hex");
const leaf = hashFn("a");
const proof = tree.getProof(leaf);
// console.log(tree);
// console.log(tree.verify(proof, leaf, root)); // true

// Takes a hex-encoded string and splits it into an array of N strings each
// representing a 32-byte unsigned int, which is the format Zokrates seems
// happiest with.
const hexToZok32 = (hex) =>
  hex
    .split(/(.{8})/)
    .filter((c) => c.length > 0)
    .map((chunk) => parseInt(chunk, 16).toString());

const buffer = Buffer.from(
  "0000003200000000000000000000000000000000000000000000000000000000",
  "hex"
);

async function main() {
  const zok = await initialize();

  const source = (await fs.promises.readFile(path.join(__dirname, "../proof.zok"))).toString();
  const artifacts = zok.compile(source);

  // console.log("Expected: ", hexToZok32(tree.getLayers()[0][0]));
  // computation
  const { witness, output } = zok.computeWitness(artifacts, [
    hexToZok32("14ede5e8e97ad9372327728f5099b95604a39593cac3bd38a343ad76205213e7"),
    hexToZok32("ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"),
    [
      {
        isRightNode: true,
        otherDigest: hexToZok32("3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d"),
      },
      {
        isRightNode: true,
        otherDigest: hexToZok32("bffe0b34dba16bc6fac17c08bac55d676cded5a4ade41fe2c9924a5dde8f3e5b"),
      },
    ],
  ]);

  console.log("Execution succeeded");
  console.log(output);

  // console.log(
  //   crypto
  //     .createHash("sha256")
  //     .update(
  //       Buffer.from(
  //         "0000003200000000000000000000000000000000000000000000000000000000" +
  //           "0000003200000000000000000000000000000000000000000000000000000000",
  //         "hex"
  //       )
  //     )
  //     .digest("hex")
  // );
}

main().catch(console.error);
