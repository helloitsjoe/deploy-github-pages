#!/bin/bash

set -Ceuo pipefail

repo_uri="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
remote_name="origin"
main_branch="main"
target_branch="main"
build_dir="docs"

cd "${GITHUB_WORKSPACE}"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

# git checkout "$target_branch"
# git rebase "${remote_name}/${main_branch}"

# ./bin/build "$build_dir"
yarn --frozen-lockfile
yarn build

git add "$build_dir"

git commit -m "Deploy GitHub Pages"
if [ $? -ne 0 ]; then
    echo "nothing to commit"
    exit 0
fi

git remote set-url "$remote_name" "$repo_uri"
git push --force-with-lease "$remote_name" "$target_branch"
