const fs = require("fs");
const path = require("path");

const rootDir = "src/assets/Problems";
const outputPath = "src/assets/assets.json";

const getRelativePath = (thePath) => {
  const index = thePath.indexOf("assets");
  return thePath.substring(index);
}

const createObject = (dirPath) => {
  const dirName = path.basename(dirPath);
  const normalizedDirName = dirName.trim().toLowerCase();

  if (normalizedDirName.includes("problems")) {
    // If directory name includes "problems", recurse into its subdirectories
    const subdirs = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(dirPath, dirent.name));

    const subObjects = subdirs.map(subdir => createObject(subdir));

    return Object.assign({}, ...subObjects);
  }

  const obj = {
    [normalizedDirName]: {
      questionSequence: [],
      options: {},
      answer: "",
    },
  };

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      obj[normalizedDirName][file] = createObject(filePath);
    } else if (stats.isFile()) {
      const extname = path.extname(filePath).toLowerCase();
      const basename = path.basename(filePath);

      if (extname === ".png" && !isNaN(basename.split(".")[0])) {
        const num = basename.split(".")[0];
        obj[normalizedDirName].options[num] = getRelativePath(filePath)
      } else if (extname === ".txt" && basename === "ProblemAnswer.txt") {
        obj[normalizedDirName].answer = fs.readFileSync(filePath, "utf-8").trim();
      } else if (extname === ".png") {
        const letter = basename.split(".")[0];
        // check if letter does not contain the text Basic Problem
        if (!letter.includes("Problem")) {
          obj[normalizedDirName].questionSequence.push(getRelativePath(filePath));
        }
      }
    }
  });

  return obj;
};

const result = createObject(rootDir);
const jsonString = JSON.stringify(result, null, 2);

fs.writeFileSync(outputPath, jsonString);

console.log(`JSON file generated at ${outputPath}`);
