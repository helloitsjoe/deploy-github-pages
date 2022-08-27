const { cmd } = require('./utils');

const setConfig = (actor) => {
  cmd(`git config user.name ${actor}`);
  cmd(`git config user.email ${actor}@bots.github.com`);
};

const branchExists = (branch) => {
  const exists = cmd(`git ls-remote --heads origin ${branch}`);
  console.log(`Branch exists:`, exists);
  return exists;
};

const createNewBranch = (branch) => {
  cmd(`git checkout -b ${branch}`);
  cmd(`git push -u origin ${branch}`);
};

const getBranchName = () =>
  cmd(`git name-rev --name-only HEAD | sed 's/remotes\\/origin\\///g'`) || '';

// Simple sanitization for now, only replace slash with dash
const sanitizeBranchName = (branch) => branch.replace('/', '-');

const checkOrCreateBranch = (branch) => {
  if (branchExists(branch)) {
    console.log('Branch exists, continuing...');
    return;
  }
  console.log('Target branch does not exist, creating...');
  createNewBranch(branch);
};

const addAndCommit = ({ dir, isBranch }) => {
  try {
    console.log('Staging changes...');
    const message = isBranch ? `Deploy to ${dir}` : 'Deploy';
    cmd(`git add ${dir}`);
    cmd(`git status`);
    cmd(`git commit -m "${message} :rocket:"`);
  } catch (err) {
    console.log('Caught error:', err);
    console.log('No changes, exiting...');
    process.exit(0);
  }
};

module.exports = {
  setConfig,
  checkOrCreateBranch,
  sanitizeBranchName,
  addAndCommit,
  getBranchName,
};
