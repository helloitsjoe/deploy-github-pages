const { execSync } = require('child_process');

const cmd = command =>
  execSync(command, { stdio: 'inherit', encoding: 'utf8' });

module.exports = { cmd };
