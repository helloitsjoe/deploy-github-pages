#!/bin/bash

set -Ceuo pipefail

github_token=${1}
remote_name=${2} # origin
main_branch=${3} # main
target_branch=${4} # gh-pages
build_dir=${5} # dist
target_dir=${6:-GITHUB_WORKSPACE} # GitHub workspace root

echo "Repo: ${GITHUB_REPOSITORY}"
echo "Workspace: ${GITHUB_WORKSPACE}"
echo "Actor: ${GITHUB_ACTOR}"
echo "Target dir: ${target_dir}"

repo_uri="https://x-access-token:${github_token}@github.com/${GITHUB_REPOSITORY}.git"

cd "${GITHUB_WORKSPACE}"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@bots.github.com"

git checkout "${target_branch}"
git rebase "${remote_name}/${main_branch}"

yarn --frozen-lockfile
yarn build

if [[ "${build_dir}" -ne "${target_dir}"]]; then
    cp -r "${build_dir}" "${target_dir}"
fi

git add "${target_dir}"

set +e
git status
git commit -m "Deploy :robot:"
if [[ $? -ne 0 ]]; then
    echo "Exiting"
    exit 0
fi
set -e

git remote set-url "${remote_name}" "${repo_uri}"
git push --force-with-lease "${remote_name}" "${target_branch}"
