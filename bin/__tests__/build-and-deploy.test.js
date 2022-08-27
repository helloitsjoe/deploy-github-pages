const buildAndDeploy = require('../build-and-deploy');
const { cmd } = require('../utils');

jest.mock('../utils');

process.chdir = jest.fn();

const config = {
  githubWorkspace: '/root/dir',
  githubActor: 'some-actor',
};

beforeEach(() => {
  cmd.mockReturnValue();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('main', () => {
  it('does not commit or push for dependabot branches', () => {
    buildAndDeploy({
      ...config,
      branchBuild: true,
      deployBranchName: 'dependabot-foo',
      // Skip git push in gh.checkOrCreateBranch
      targetBranchExists: true,
    });

    expect(cmd).not.toBeCalledWith(expect.stringContaining('git add'));
    expect(cmd).not.toBeCalledWith(expect.stringContaining('git commit'));
    expect(cmd).not.toBeCalledWith(expect.stringContaining('git push'));
  });

  it('throws if target dir is root', () => {
    expect(() => buildAndDeploy({ ...config, targetBranch: 'main' })).toThrow(
      /Build dir appears to be project root, not supported./
    );
  });

  it('sanitizes branches with slashes', () => {
    buildAndDeploy({
      ...config,
      branchBuild: true,
      deployBranchName: 'some/branch',
      // Skip git push in gh.checkOrCreateBranch
      targetBranchExists: true,
    });

    expect(cmd).toBeCalledWith(expect.stringContaining('branch-some-branch'));
    expect(cmd).not.toBeCalledWith(
      expect.stringContaining('branch-some/branch')
    );
  });
});

describe('CLI Commands', () => {
  it('deploys to gh-pages by default', () => {
    buildAndDeploy(config);
    const args = cmd.mock.calls.map((call) => call[0]);
    expect(args).toMatchInlineSnapshot(`
      Array [
        "git config user.name some-actor",
        "git config user.email some-actor@bots.github.com",
        "git ls-remote --heads origin gh-pages",
        "git checkout -b gh-pages",
        "git push -u origin gh-pages",
        "yarn --frozen-lockfile",
        "yarn build",
        "mv dist tmp_deploy",
        "git add /root/dir",
        "git status",
        "git commit -m \\"Deploy :rocket:\\"",
        "git push origin $(git subtree split --prefix tmp_deploy):gh-pages --force",
      ]
    `);
  });

  it('runs commands for main build', () => {
    buildAndDeploy({ ...config, buildDir: 'public', targetDir: 'dist' });
    const args = cmd.mock.calls.map((call) => call[0]);
    expect(args).toMatchInlineSnapshot(`
      Array [
        "git config user.name some-actor",
        "git config user.email some-actor@bots.github.com",
        "git ls-remote --heads origin gh-pages",
        "git checkout -b gh-pages",
        "git push -u origin gh-pages",
        "git checkout gh-pages",
        "git rebase origin/main",
        "yarn --frozen-lockfile",
        "yarn build",
        "mv -v public dist",
        "git add dist",
        "git status",
        "git commit -m \\"Deploy :rocket:\\"",
        "git push --force-with-lease origin gh-pages",
      ]
    `);
  });

  it('runs commands for branch build', () => {
    buildAndDeploy({
      ...config,
      branchBuild: true,
      deployBranchName: 'testing',
    });
    const args = cmd.mock.calls.map((call) => call[0]);
    expect(args).toMatchInlineSnapshot(`
      Array [
        "git config user.name some-actor",
        "git config user.email some-actor@bots.github.com",
        "git ls-remote --heads origin gh-pages",
        "git checkout -b gh-pages",
        "git push -u origin gh-pages",
        "yarn --frozen-lockfile",
        "yarn build",
        "mv dist tmp_branch-testing",
        "git fetch",
        "git checkout gh-pages",
        "git pull --rebase",
        "rm -rf branch-testing",
        "mv tmp_branch-testing branch-testing",
        "git add branch-testing",
        "git status",
        "git commit -m \\"Deploy to branch-testing :rocket:\\"",
        "git push",
      ]
    `);
  });
});
