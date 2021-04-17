const cp = require('child_process');

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

console.log('cwd', process.cwd());
process.chdir(GITHUB_WORKSPACE);
console.log('cwd', process.cwd());

cp.execSync(`git config user.name ${GITHUB_ACTOR}`);
cp.execSync(`git config user.email ${GITHUB_ACTOR}@bots.github.com`);
