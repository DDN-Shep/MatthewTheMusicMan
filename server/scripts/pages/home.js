module.exports = function(context) {
  'use strict';

  var carousel = require('../components/carousel.min.js');

  console.log('Home.js', arguments);

  (function initialise() {
    carousel();
  })();
};
