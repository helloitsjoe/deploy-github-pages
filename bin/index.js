const buildAndDeploy = require('./build-and-deploy');

try {
  buildAndDeploy();
} catch (e) {
  console.error(e);
  process.exit(1);
}
