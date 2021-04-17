const fs = require('fs');
// const core = require('@actions/core');
// const gh = require('@actions/github');

// console.log(`process.env:`, process.env);

// console.log(`gh:`, gh);
// console.log(`context:`, gh.getOctokit());

const {
  GITHUB_WORKSPACE,
  GITHUB_ACTOR,
  INPUT_TARGET_DIR,
  INPUT_MAIN_BRANCH: MAIN_BRANCH,
  INPUT_TARGET_BRANCH: TARGET_BRANCH,
  INPUT_BUILD_DIR: BUILD_DIR,
  INPUT_BRANCH_BUILD: BRANCH_BUILD,
} = process.env;

const TARGET_DIR = INPUT_TARGET_DIR || GITHUB_WORKSPACE;

console.log(`TARGET_DIR: ${TARGET_DIR}`);

// Looks like auth was needed previously, doesn't seem to be anymore
// REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

console.log(`Workspace: ${GITHUB_WORKSPACE}`);
console.log(`Main branch: ${MAIN_BRANCH}`);
console.log(`Target branch: ${TARGET_BRANCH}`);
console.log(`Build dir: ${BUILD_DIR}`);
console.log(`Target dir: ${TARGET_DIR}`);
console.log(`Branch build: ${BRANCH_BUILD}`);

process.chdir(GITHUB_WORKSPACE);

fs.execSync(`git config user.name ${GITHUB_ACTOR}`);
fs.execSync(`git config user.email ${GITHUB_ACTOR}@bots.github.com`);
