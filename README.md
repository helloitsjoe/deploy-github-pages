# Deploy GitHub Pages

This action deploys your built JS to GitHub Pages. It assumes you're deploying
to the `dist` folder on the `gh-pages` branch but allows for other
configuration.

## Inputs

### `remote_name`

Default `origin`

### `main_branch`

The repo's main branch. **Default `main`**

### `target_branch`

The target branch to deploy. **Default `gh-pages`**

### `build_dir`

The output directory of your built JavaScript. **Default `dist`**

### `target_dir`

The directory where built files will be deployed. **Default repo root**

### `branch_build`

If `true`, the built files will be deployed to a subdirectory named with the
branch name. **Default `false`**

<!-- ### `github_token`

**REQUIRED** Your GitHub token, available in workflow as
`${{ secrets.GITHUB_TOKEN }}` -->

## Example usage

### Default deploys to root of `gh-pages` branch

```yml
uses: helloitsjoe/deploy-github-pages@v2
```

### Example to deploy to `main` branch `docs` directory

```yml
uses: helloitsjoe/deploy-github-pages@v2
with:
  target_branch: main
  build_dir: docs
```

### Example to deploy to `main` branch as a branch build

```yml
uses: helloitsjoe/deploy-github-pages@v2
with:
  branch_build: true
```

This will deploy to a subdirectory named after the branch name. The branch name
comes from the `HEAD` commit. For example, in a repo named `username/my-repo`,
if the most recent commit is on a branch named `my-feature`, it will be deployed
to `username.github.io/my-repo/my-feature`
