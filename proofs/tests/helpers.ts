const { toBufferBE, toBigIntBE } = require("bigint-buffer");

// Conversion and serialization helpers
export const bufferToBigInt = (buffer: Buffer) => toBigIntBE(buffer) as BigInt;
export const bigIntToBuffer = (bigInt: BigInt) => toBufferBE(bigInt, 32) as Buffer;
export const bufferToZok64 = (buffer: Buffer) =>
  buffer
    .toString("hex")
    .split(/(.{16})/)
    .filter((c) => c.length > 0)
    .map((chunk) => parseInt(chunk, 16).toString());
export const bufferToZokField = (buffer: Buffer) => numToZok(bufferToBigInt(buffer));
export const numToZok = (num: number | BigInt) => "0x" + num.toString(16);
export const stringToNum = (str: string) => bufferToBigInt(Buffer.from(str));
