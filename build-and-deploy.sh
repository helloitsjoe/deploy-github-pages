#!/bin/bash

set -Ceuo pipefail

if [ "${TARGET_DIR+x}" = "x" ]; then
  TARGET_DIR="${GITHUB_WORKSPACE}"
fi

# REPO_URI="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo "Repo: ${GITHUB_REPOSITORY}"
echo "Workspace: ${GITHUB_WORKSPACE}"
echo "Actor: ${GITHUB_ACTOR}"
echo "Build dir: ${BUILD_DIR}"
echo "Target dir: ${TARGET_DIR}"

cd "${GITHUB_WORKSPACE}"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

if [ "${TARGET_BRANCH}" = "gh-pages" ]; then
  if [ "${TARGET_DIR}" = "${GITHUB_WORKSPACE}" ]; then
    # Only push subtree if we're on gh-pages
    echo "gh-pages, pushing subtree..."
    # git checkout "${main_branch}"
    yarn --frozen-lockfile
    yarn build

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

    # git remote set-url "${REMOTE_NAME}" "${REPO_URI}"
    git push "${REMOTE_NAME}" `git subtree split --prefix ${BUILD_DIR}`:gh-pages --force
    # git subtree push --prefix "${build_dir}" origin gh-pages
    echo 'Pushed subtree, exiting...'
    exit 0
  fi
fi

git checkout "${TARGET_BRANCH}"
git rebase "${REMOTE_NAME}/${MAIN_BRANCH}"

# TODO: Remove this to cache node_modules
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

# git remote set-url "${REMOTE_NAME}" "${REPO_URI}"
git push --force-with-lease "${REMOTE_NAME}" "${TARGET_BRANCH}"
