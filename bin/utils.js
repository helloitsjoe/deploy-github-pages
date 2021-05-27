const { execSync } = require('child_process');

const cmd = command => {
  const rtn = execSync(command, { encoding: 'utf8' });
  if (rtn && rtn.trim()) console.log(rtn);
  return rtn;
};

module.exports = { cmd };
