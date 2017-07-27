'use strict';
const React = require('react');
const { configure, addDecorator } = require('@storybook/react');
const { Provider } = require(process.env.STORYBOOK_APP_ROOT +
  '/node_modules/rebass');

const uiStories = require.context(
  process.env.STORYBOOK_APP_ROOT + '/src/UI',
  true,
  /\.stories\.js$/
);

addDecorator(story => React.createElement(Provider, [], story()));

function loadStories() {
  uiStories.keys().forEach(filename => uiStories(filename));
  require(process.env.STORYBOOK_APP_ROOT + '/stories');
}

configure(loadStories, module);
