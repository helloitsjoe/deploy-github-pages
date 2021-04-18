const { execSync } = require('child_process');

const setConfig = () => {
  execSync(`git config user.name ${GITHUB_ACTOR}`);
  execSync(`git config user.email ${GITHUB_ACTOR}@bots.github.com`);
};

const branchExists = branch => {
  const exists = execSync(`git ls-remote --heads origin ${branch}`, {
    encoding: 'utf-8',
  });
  console.log(`Branch exists:`, exists);
  return exists;
};

const createNewBranch = branch => {
  execSync(`git checkout -b ${branch}`);
  execSync(`git push -u origin ${branch}`);
};

const checkOrCreateBranch = branch => {
  if (targetBranchExists(branch)) {
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
    execSync(`git add ${dir}`);
    execSync(`git status`);
    execSync(`git commit -m "${message} :rocket:"`);
  } catch (err) {
    console.log('Caught error:', err);
    console.log('No changes, exiting...');
    process.exit(0);
  }
};

module.exports = {
  setConfig,
  checkOrCreateBranch,
  addAndCommit,
};
