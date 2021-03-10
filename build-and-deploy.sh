#!/bin/bash

set -Ceuo pipefail

remote_name=${1}
main_branch=${2}
target_branch=${3}
build_dir=${4}
github_token=${4}

echo "Repo: ${GITHUB_REPOSITORY}"
repo_uri="https://x-access-token:${github_token}@github.com/${GITHUB_REPOSITORY}.git"

echo "Workspace: ${GITHUB_WORKSPACE}"
cd "${GITHUB_WORKSPACE}"

echo "Actor: ${GITHUB_ACTOR}"
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

# git checkout "$target_branch"
# git rebase "${remote_name}/${main_branch}"

# ./bin/build "$build_dir"
yarn --frozen-lockfile
yarn build

git add "$build_dir"

git status
# git commit -m "Deploy GitHub Pages"
# if [ $? -ne 0 ]; then
#     echo "nothing to commit"
#     exit 0
# fi

# git remote set-url "$remote_name" "$repo_uri"
# git push --force-with-lease "$remote_name" "$target_branch"
