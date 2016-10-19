'use strict';

let express = require('express'),
    path = require('path'),
    port = process.env.port || 1337;

((app) => {
  let client = path.join(__dirname + '/client'),
      index = path.join(client + '/index.html');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (next) next();
  });

  app.use(express.static(client));

  app.get('*', (req, res) => {
    res.sendFile(index);
  });

  app.listen(port, () => {
      console.log('Server listening on port %s...', port);
  });
})(express());
