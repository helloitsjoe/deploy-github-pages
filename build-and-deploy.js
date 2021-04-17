const { execSync } = require('child_process');

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

// Looks like auth was needed previously, doesn't seem to be anymore
// REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

console.log(`Workspace: ${GITHUB_WORKSPACE}`);
console.log(`Main branch: ${MAIN_BRANCH}`);
console.log(`Target branch: ${TARGET_BRANCH}`);
console.log(`Build dir: ${BUILD_DIR}`);
console.log(`Target dir: ${TARGET_DIR}`);
console.log(`Branch build: ${BRANCH_BUILD}`);

process.chdir(GITHUB_WORKSPACE);

execSync(`git config user.name ${GITHUB_ACTOR}`);
execSync(`git config user.email ${GITHUB_ACTOR}@bots.github.com`);

if (execSync(`git ls-remote --heads origin ${TARGET_BRANCH}`)) {
  console.log('Branch exists, continuing...');
} else {
  console.log('Target branch does not exist, creating...');
  execSync(`git checkout -b ${TARGET_BRANCH}`);
  execSync(`git push -u origin ${TARGET_BRANCH}`);
}

// # TODO: clean this up by integrating below
// if [ "${TARGET_BRANCH}" = "gh-pages" ]; then
//   if [ "${TARGET_DIR}" = "${GITHUB_WORKSPACE}" ]; then
//     # Only push subtree if we're on gh-pages
//     echo "gh-pages, pushing subtree..."
//     yarn --frozen-lockfile
//     yarn build

//     # This works, but dir will be overwritten by main branch deploy
//     if [ "${BRANCH_BUILD}" ]; then
//       branch_name=$(git name-rev --name-only HEAD | sed 's/remotes\/origin\///g')
//       branch_name_with_prefix="branch-$branch_name"
//       echo "Deploying to directory: $branch_name_with_prefix"
//       mv "${BUILD_DIR}" "tmp_${branch_name_with_prefix}"

//       git fetch
//       git checkout "${TARGET_BRANCH}"
//       git pull --rebase

//       echo "Overwriting old branch folder if it exists..."
//       rm -rf "${branch_name_with_prefix}"
//       mv "tmp_${branch_name_with_prefix}" "${branch_name_with_prefix}"

//       git add "${branch_name_with_prefix}"
//       git commit -m "Deploy to /${branch_name_with_prefix} :rocket:"
//       git push
//       echo 'Pushed hash directory, exiting...'
//       exit 0;
//     fi

//     # rename dir to allow including build dir in .gitignore
//     # (so build dir can be ignored in main branch)
//     mv "${BUILD_DIR}" tmp_deploy

//     echo 'Staging changes...'
//     git add "${TARGET_DIR}"
//     ls
//     set +e
//     git status
//     git commit -m "Deploy :rocket:"
//     if [ $? -ne 0 ]; then
//       echo "Exiting"
//       exit 0
//     fi
//     set -e

//     git push "${REMOTE_NAME}" `git subtree split --prefix tmp_deploy`:gh-pages --force
//     echo 'Pushed subtree, exiting...'
//     exit 0
//   fi
// fi

// echo "Checking out branch..."

// git checkout "${TARGET_BRANCH}"
// git rebase "${REMOTE_NAME}/${MAIN_BRANCH}"

// # Don't think an extra `yarn` does any harm here if we use yarn cache in pipeline
// yarn --frozen-lockfile
// yarn build

// if [ "${BUILD_DIR}" != "${TARGET_DIR}" ]; then
//   # Disabling this - don't put built code in root
//   # if [ "${TARGET_DIR}" = "${GITHUB_WORKSPACE}" ]; then
//   #   echo "Moving contents of ${BUILD_DIR} to ${TARGET_DIR}"
//   #   mv -v "${BUILD_DIR}/"* "${TARGET_DIR}/"
//   # else
//   echo "Renaming ${BUILD_DIR} to ${TARGET_DIR}"
//   mv -v "${BUILD_DIR}" "${TARGET_DIR}"
//   # fi
// else
//   echo "Build and target dirs are the same, continuing..."
// fi

// echo 'Staging changes...'
// git add "${TARGET_DIR}"

// set +e
// git status
// git commit -m "Deploy :rocket:"
// if [ $? -ne 0 ]; then
//   echo "Exiting"
//   exit 0
// fi
// set -e

// git push --force-with-lease "${REMOTE_NAME}" "${TARGET_BRANCH}"
