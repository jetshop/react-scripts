'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const express = require('express');
const compression = require('compression');
const fs = require('fs');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const renderOnServer = require(paths.appBuild + '/server/server').default;

const PORT = parseInt(process.env.PORT, 10) || 3000;

if (!checkRequiredFiles([paths.appHtml, paths.appBuild])) {
  process.exit(1);
}

const template = fs.readFileSync(paths.appBuild + '/index.html', 'utf8');
const app = express();

app.use(compression()); // gzip
app.use(express.static(paths.appBuild + '/client')); // serve static files

app.use((req, res) => {
  console.log(req.method, req.url)
  renderOnServer(req.url).then(({ error, redirectLocation, inject }) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation);
    } else {
      const html = Object.keys(inject).reduce(
        (output, key) => output.replace(`<slot name="${key}"/>`, inject[key]),
        template
      );
      res.status(200).send(html);
    }
  })
  .catch(res.error);
});

app.listen(PORT, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Listening to port', PORT);
  }
});
