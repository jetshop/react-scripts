'use strict';

class ReplaceHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data, callback) => {
          data.html = this.replacements.reduce(
            (html, replacement) =>
              html.replace(replacement.pattern, replacement.value),
            data.html
          );
          callback(null, data);
        }
      );
    });
  }
}

module.exports = ReplaceHtmlPlugin;
