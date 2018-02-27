const path = require('path');
const { spawn, spawnSync } = require('child_process');

const script = process.argv[2];

switch(script) {
  case 'watch':
    console.log('watching css')
    spawn('stylus', ['--sourcemap', '-w', 'src/styles/stylus', '--out', 'src/styles']);
    break;
  case 'build':
    spawnSync('stylus', ['src/styles/stylus', '--out', 'src/styles']);
    break;
  default:
    console.log('Unknown script: ' + script);
    console.log('Perhaps you meant to run `react-scripts` or `react-scripts-with-stylus start`');
    break;
}
