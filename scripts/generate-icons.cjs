// Regenerate metadata icons from the code-native brand initial, without a new dependency.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

async function main() {
  const app = path.resolve(__dirname, "../src/app");
  const source = await fs.readFile(path.join(app, "icon.svg"));
  await sharp(source).resize(180, 180).png().toFile(path.join(app, "apple-icon.png"));
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()));
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    directory[entry] = sizes[index];
    directory[entry + 1] = sizes[index];
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(image.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });
  await fs.writeFile(path.join(app, "favicon.ico"), Buffer.concat([directory, ...images]));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
