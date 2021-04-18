const { execSync } = require('child_process');
const gh = require('./github');

const main = () => {
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

  console.log(`Workspace: ${GITHUB_WORKSPACE}`);
  console.log(`Main branch: ${MAIN_BRANCH}`);
  console.log(`Target branch: ${TARGET_BRANCH}`);
  console.log(`Build dir: ${BUILD_DIR}`);
  console.log(`Target dir: ${TARGET_DIR}`);
  console.log(`Branch build: ${BRANCH_BUILD}`);

  // Looks like auth was needed previously, doesn't seem to be anymore
  // REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

  process.chdir(GITHUB_WORKSPACE);

  gh.setConfig(GITHUB_ACTORkk);
  gh.checkOrCreateBranch(TARGET_BRANCH);

  if (TARGET_BRANCH === 'gh-pages' && TARGET_DIR === GITHUB_WORKSPACE) {
    // Only push subtree if we're on gh-pages
    console.log('Deploying to gh-pages root...');
    execSync('yarn --frozen-lockfile');
    execSync('yarn build');

    // This works, but dir will be overwritten by main branch deploy
    if (BRANCH_BUILD) {
      const branchName = execSync(
        `git name-rev --name-only HEAD | sed 's/remotes\\/origin\\///g'`,
        { encoding: 'utf-8' }
      ).trim();

      const branchNameWithPrefix = `branch-${branchName}`;
      const tmpDir = `tmp_${branchNameWithPrefix}`;
      execSync(`mv ${BUILD_DIR} ${tmpDir}`);

      execSync(`git fetch`);
      execSync(`git checkout ${TARGET_BRANCH}`);
      execSync(`git pull --rebase`);

      console.log('Overwriting old branch folder if it exists...');
      execSync(`rm -rf ${branchNameWithPrefix}`);
      execSync(`mv ${tmpDir} ${branchNameWithPrefix}`);

      gh.addAndCommit({ dir: branchNameWithPrefix, isBranch: true });

      execSync(`git push`);
      console.log('Pushed branch directory, exiting...');
      process.exit(0);
    }

    // rename dir to allow including build dir in .gitignore
    // (so build dir can be ignored in main branch)
    execSync(`mv ${BUILD_DIR} tmp_deploy`);

    gh.addAndCommit({ dir: TARGET_DIR });

    execSync(
      `git push ${REMOTE_NAME} $(git subtree split --prefix tmp_deploy):gh-pages --force`
    );
    console.log('Pushed subtree, exiting...');
    process.exit(0);
  }

  console.log('Checking out branch...');
  execSync(`git checkout ${TARGET_BRANCH}`);
  execSync(`git rebase ${REMOTE_NAME}/${MAIN_BRANCH}`);

  // Extra `yarn` here is quick if we use yarn cache in pipeline
  execSync('yarn --frozen-lockfile');
  execSync('yarn build');

  if (BUILD_DIR !== TARGET_DIR) {
    if (TARGET_DIR === GITHUB_WORKSPACE) {
      console.log('Build dir appears to be project root. Skipping...');
      process.exit(1);
    }
    console.log(`Renaming ${BUILD_DIR} to ${TARGET_DIR}`);
    execSync(`mv -v ${BUILD_DIR} ${TARGET_DIR}`);
  } else {
    console.log('Build and target dirs are the same, continuing...');
  }

  gh.addAndCommit({ dir: TARGET_DIR });

  execSync(`git push --force-with-lease ${REMOTE_NAME} ${TARGET_BRANCH}`);
};

main();
