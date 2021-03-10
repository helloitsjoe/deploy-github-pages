# Deploy GitHub Pages

This action deploys your built JS to GitHub Pages. It assumes you're deploying
to the `docs` folder on the `main` branch but allows for other configuration.

## Inputs

### `remote_name`

Default `origin`

### `main_branch`

The repo's main branch. Default `main`

### `target_branch`

The target branch to deploy. Default `main`

### `build_dir`

The output directory of your built JavaScript. Default `docs`

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
  target_branch: gh-pages
  build_dir: dist
  github_token: ${{ secrets.GITHUB_TOKEN }}
```
