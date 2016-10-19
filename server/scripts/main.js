$(function() {
  'use strict';

  var navbar = require('./components/navbar.min.js');

  (function initialise() {
    //page('/', load.bind(require('./pages/home.min.js')));
    //page('/todo', load.bind(require('./pages/todo.min.js')));
    page('*', function() {
      console.log('404', arguments);
    });
    page();
  })();
});
