'use strict';

const path = require('path');
const { configure } = require('@storybook/react');

function loadStories() {
  require(process.env.STORYBOOK_APP_ROOT + '/stories');
}

configure(loadStories, module);
