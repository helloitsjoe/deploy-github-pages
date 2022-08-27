const { cmd } = require('./utils');
const gh = require('./github');

const branchDeploy = (
  buildDir,
  targetBranch,
  rawDeployBranchName = gh.getBranchName()
) => {
  // Branch build works, but dir will be overwritten by main branch deploy

  cmd('yarn --frozen-lockfile');
  cmd('yarn build');

  const deployBranchName = gh.sanitizeBranchName(rawDeployBranchName);

  if (deployBranchName.match(/dependabot/)) {
    console.log('Skipping dependabot branch deploy...');
    return;
  }

  const branchWithPrefix = `branch-${deployBranchName}`;
  const tmpDir = `tmp_${branchWithPrefix}`;
  cmd(`mv ${buildDir} ${tmpDir}`);

  cmd(`git fetch`);
  cmd(`git checkout ${targetBranch}`);
  cmd(`git pull --rebase`);

  console.log(`Overwriting folder ${branchWithPrefix} if it exists...`);
  cmd(`rm -rf ${branchWithPrefix}`);
  cmd(`mv ${tmpDir} ${branchWithPrefix}`);

  gh.addAndCommit({ dir: branchWithPrefix, isBranch: true });

  cmd(`git push`);
  console.log('Pushed branch directory, exiting...');
};

const deployToRootGhPagesBranch = ({ buildDir, targetDir, remoteName }) => {
  console.log('Deploying to gh-pages branch...');

  cmd('yarn --frozen-lockfile');
  cmd('yarn build');

  // rename dir to allow including build dir in .gitignore
  // (so build dir can be ignored in main branch)
  cmd(`mv ${buildDir} tmp_deploy`);

  gh.addAndCommit({ dir: targetDir });

  cmd(
    `git push ${remoteName} $(git subtree split --prefix tmp_deploy):gh-pages --force`
  );

  console.log('Deployed to gh-pages, exiting...');
  return;
};

const deployToDir = ({
  targetBranch,
  remoteName,
  mainBranch,
  buildDir,
  targetDir,
  githubWorkspace,
}) => {
  console.log('Checking out branch...');
  cmd(`git checkout ${targetBranch}`);
  cmd(`git rebase ${remoteName}/${mainBranch}`);

  // Extra `yarn` here is quick if we use yarn cache in pipeline
  cmd('yarn --frozen-lockfile');
  cmd('yarn build');

  if (buildDir !== targetDir) {
    if (targetDir === githubWorkspace) {
      throw new Error('Build dir appears to be project root, not supported.');
    }
    console.log(`Renaming ${buildDir} to ${targetDir}`);
    cmd(`mv -v ${buildDir} ${targetDir}`);
  } else {
    console.log('Build and target dirs are the same, continuing...');
  }

  gh.addAndCommit({ dir: targetDir });

  cmd(`git push --force-with-lease ${remoteName} ${targetBranch}`);
};

const {
  GITHUB_WORKSPACE,
  GITHUB_ACTOR,
  INPUT_TARGET_DIR,
  INPUT_MAIN_BRANCH,
  INPUT_TARGET_BRANCH,
  INPUT_BUILD_DIR,
  INPUT_BRANCH_BUILD,
  INPUT_REMOTE_NAME,
} = process.env;

const main = ({
  githubWorkspace = GITHUB_WORKSPACE,
  githubActor = GITHUB_ACTOR,
  targetDir = INPUT_TARGET_DIR || githubWorkspace,
  mainBranch = INPUT_MAIN_BRANCH || 'main',
  targetBranch = INPUT_TARGET_BRANCH || 'gh-pages',
  buildDir = INPUT_BUILD_DIR || 'dist',
  branchBuild = INPUT_BRANCH_BUILD || false,
  remoteName = INPUT_REMOTE_NAME || 'origin',
  // For tests
  deployBranchName,
  targetBranchExists = false,
} = {}) => {
  console.log(`Workspace: ${githubWorkspace}`);
  console.log(`Main branch: ${mainBranch}`);
  console.log(`Target branch: ${targetBranch}`);
  console.log(`Build dir: ${buildDir}`);
  console.log(`Target dir: ${targetDir}`);
  console.log(`Branch build: ${branchBuild}`);

  // Looks like auth was needed previously, doesn't seem to be anymore
  // REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

  process.chdir(githubWorkspace);

  gh.setConfig(githubActor);
  if (!targetBranchExists) {
    gh.checkOrCreateBranch(targetBranch);
  }

  if (branchBuild) {
    branchDeploy(buildDir, targetBranch, deployBranchName);
    return;
  }

  if (targetBranch === 'gh-pages' && targetDir === githubWorkspace) {
    deployToRootGhPagesBranch({ buildDir, targetDir, remoteName });
    return;
  }

  deployToDir({
    targetBranch,
    remoteName,
    mainBranch,
    buildDir,
    targetDir,
    githubWorkspace,
  });
};

module.exports = main;
