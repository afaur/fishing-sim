'use strict';

var util = require('util');

module.exports = {
  src: './src/images/sprites/**/*.{png,gif,jpg}',
  destImage: './build/img/spritesheet.png',
  destCSS: './build/css/sprites.css',
  imgPath: '/img/spritesheet.png',
  padding: 1,
  algorithm: 'binary-tree',
  algorithmOpts: { sort: false },
  cssOpts: {
    cssClass: function (item) {
      return util.format('.ic-%s', item.name);
    }
  }
};
