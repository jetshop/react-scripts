'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const { ownNodeModules } = require('../config/paths');

const spawn = require('react-dev-utils/crossSpawn');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

const args = process.argv.slice(2);
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 7000;
const HOST = process.env.HOST || '0.0.0.0';

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const result = spawn.sync(
      'node',
      [
        require.resolve('../node_modules/.bin/start-storybook'),
        '--config-dir',
        path.resolve(__dirname, '../config/storybook'),
        '--port',
        port,
        '--host',
        HOST
      ].concat(args),
      {
        env: Object.assign({}, process.env, {
          STORYBOOK_APP_ROOT: appDirectory,
          NODE_PATH: ownNodeModules
        }),
        stdio: 'inherit'
      }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
