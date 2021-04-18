const { execSync } = require('child_process');

const cmd = command => {
  const rtn = execSync(command, { encoding: 'utf8' });
  console.log(rtn);
  return rtn;
};

module.exports = { cmd };
