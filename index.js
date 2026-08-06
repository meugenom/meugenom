'use strict';

require('dotenv').config();
const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";

const githubCommits = require("./src/github_commits");
const githubLanguages = require("./src/github_languages");
const leetcode = require("./src/leetcode");
const config = require("./src/config");
const svgGithubLanguages = require("./src/svg_github_sledge.js");
const svgLeetcodeTotalInfo = require("./src/svg_leetcode_circle.js");
const svgGithubTotalInfo = require("./src/svg_github_bicycle.js");

const githubToken = process.env.GH_TOKEN;

if (!githubToken) {
  throw new Error('GH_TOKEN is not defined, see .env or main.yaml in actions');
} else {
  config.github_token = githubToken;
}

const DATA = {
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Europe/Berlin",
  }),
};

function generateReadMe() {
  const data = fs.readFileSync(MUSTACHE_MAIN_DIR);
  const output = Mustache.render(data.toString(), DATA);
  fs.writeFileSync("README.md", output);
}

async function main() {
  try {
    const commitsInfo = await githubCommits.get(config.username, config.github_token);
    await svgGithubTotalInfo.generateSVG(commitsInfo);

    const languagesInfo = await githubLanguages.get(config.username, config.github_token);
    await svgGithubLanguages.generateSVG(languagesInfo.languages);

    const leetcodeInfo = await leetcode.get(config.username);
    await svgLeetcodeTotalInfo.generateSVG(leetcodeInfo);

    generateReadMe();
    console.log("README successfully updated!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

main();