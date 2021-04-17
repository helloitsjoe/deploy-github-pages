const core = require('@actions/core');
const gh = require('@actions/github');

console.log(`gh:`, gh);
console.log(`context:`, gh.context);

const GITHUB_WORKSPACE = 'foo';
const TARGET_DIR = core.getInput('target_dir') || GITHUB_WORKSPACE;
const MAIN_BRANCH = core.getInput('main_branch');
const TARGET_BRANCH = core.getInput('target_branch');
const BUILD_DIR = core.getInput('build_dir');
const BRANCH_BUILD = core.getInput('branch_build');

// const GITHUB_ACTOR

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

// fs.execSync(`git config user.name ${GITHUB_ACTOR}`);
// fs.execSync(`git config user.email ${GITHUB_ACTOR}@bots.github.com`);
