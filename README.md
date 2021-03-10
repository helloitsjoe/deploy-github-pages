# Deploy GitHub Pages

This action deploys your built JS to GitHub Pages. It assumes you're deploying
to the `dist` folder on the `gh-pages` branch but allows for other
configuration.

## Inputs

### `remote_name`

Default `origin`

### `main_branch`

The repo's main branch. Default `main`

### `target_branch`

The target branch to deploy. Default `gh-pages`

### `build_dir`

The output directory of your built JavaScript. Default `dist`

### `github_token`

**REQUIRED** Your GitHub token, available in workflow as
`${{ secrets.GITHUB_TOKEN }}`

## Example usage

```yml
uses: helloitsjoe/deploy-github-pages
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
```

```yml
uses: helloitsjoe/deploy-github-pages
with:
  target_branch: main
  build_dir: docs
  github_token: ${{ secrets.GITHUB_TOKEN }}
```
