import run from './utils/run.js';
import { pkgPath } from './utils/paths.js';
import pkg from 'gulp';
const { series } = pkg;
export const publishComponent = async () => {
  run('release-it', `${pkgPath}/suigang-cli`);
};
export default series(async () => publishComponent());
