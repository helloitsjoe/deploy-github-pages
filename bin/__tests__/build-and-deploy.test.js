const buildAndDeploy = require('../build-and-deploy');
const cp = require('child_process');

jest.mock('child_process');
process.chdir = jest.fn();

beforeEach(() => {
  cp.execSync = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('main', () => {
  it('works', () => {
    expect(buildAndDeploy).not.toThrow();
  });
});
