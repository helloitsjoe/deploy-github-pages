#!/bin/bash

set -Ceuo pipefail

echo "input TARGET_DIR: ${TARGET_DIR}"

if [ -z "${TARGET_DIR}" ]; then
  echo "TARGET_DIR not defined, using ${GITHUB_WORKSPACE}"
  TARGET_DIR="${GITHUB_WORKSPACE}"
fi

# Looks like auth was needed previously, doesn't seem to be anymore
# REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo "Workspace: ${GITHUB_WORKSPACE}"
echo "Main branch: ${MAIN_BRANCH}"
echo "Target branch: ${TARGET_BRANCH}"
echo "Build dir: ${BUILD_DIR}"
echo "Target dir: ${TARGET_DIR}"
echo "Branch build: ${BRANCH_BUILD}"

cd "${GITHUB_WORKSPACE}"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

if [[ $(git ls-remote --heads origin "${TARGET_BRANCH}") ]]; then
  echo 'Branch exists, continuing...'
else
  echo 'Target branch does not exist, creating...'
  git checkout -b "${TARGET_BRANCH}"
  git push -u origin "${TARGET_BRANCH}"
fi

# TODO: clean this up by integrating below
if [ "${TARGET_BRANCH}" = "gh-pages" ]; then
  if [ "${TARGET_DIR}" = "${GITHUB_WORKSPACE}" ]; then
    # Only push subtree if we're on gh-pages
    echo "gh-pages, pushing subtree..."
    yarn --frozen-lockfile
    yarn build

    # This works, but dir will be overwritten by main branch deploy
    if [ "${BRANCH_BUILD}" ]; then
      branch_name=$(git name-rev --name-only HEAD | sed 's/remotes\/origin\///g')
      branch_name_with_prefix="branch-$branch_name"
      echo "Deploying to directory: $branch_name_with_prefix"
      mv "${BUILD_DIR}" "tmp_${branch_name_with_prefix}"

      git fetch
      git checkout "${TARGET_BRANCH}"
      git pull --rebase

      echo "Overwriting old branch folder if it exists..."
      mv "tmp_${branch_name_with_prefix}" "${branch_name_with_prefix}"

      git add "${branch_name_with_prefix}"
      git commit -m "Deploy with ${branch_name_with_prefix} :rocket:"
      git push
      echo 'Pushed hash directory, exiting...'
      exit 0;
    fi

    # rename dir to allow including build dir in .gitignore
    # (so build dir can be ignored in main branch)
    mv "${BUILD_DIR}" tmp_deploy

    echo 'Staging changes...'
    git add "${TARGET_DIR}"
    ls
    set +e
    git status
    git commit -m "Deploy :rocket:"
    if [ $? -ne 0 ]; then
      echo "Exiting"
      exit 0
    fi
    set -e

    git push "${REMOTE_NAME}" `git subtree split --prefix tmp_deploy`:gh-pages --force
    echo 'Pushed subtree, exiting...'
    exit 0
  fi
fi

echo "Checking out branch..."

git checkout "${TARGET_BRANCH}"
git rebase "${REMOTE_NAME}/${MAIN_BRANCH}"

# Don't think an extra `yarn` does any harm here if we use yarn cache in pipeline
yarn --frozen-lockfile
yarn build

if [ "${BUILD_DIR}" != "${TARGET_DIR}" ]; then
  # Disabling this - don't put built code in root
  # if [ "${TARGET_DIR}" = "${GITHUB_WORKSPACE}" ]; then
  #   echo "Moving contents of ${BUILD_DIR} to ${TARGET_DIR}"
  #   mv -v "${BUILD_DIR}/"* "${TARGET_DIR}/"
  # else
  echo "Renaming ${BUILD_DIR} to ${TARGET_DIR}"
  mv -v "${BUILD_DIR}" "${TARGET_DIR}"
  # fi
else
  echo "Build and target dirs are the same, continuing..."
fi

echo 'Staging changes...'
git add "${TARGET_DIR}"

set +e
git status
git commit -m "Deploy :rocket:"
if [ $? -ne 0 ]; then
  echo "Exiting"
  exit 0
fi
set -e

git push --force-with-lease "${REMOTE_NAME}" "${TARGET_BRANCH}"
