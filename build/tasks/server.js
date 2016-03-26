var app        = require('express')();
var bodyParser = require('body-parser');
var cors       = require('cors');
var server;

app.use(bodyParser.json());

app.use(cors());

app.all('*', function(req, res) {
  res.send({
    path: req.path,
    query: req.query,
    body: req.body,
    host: req.hostname,
    method: req.method
  });
});

module.exports = {
  start: function(done) {
    server = app.listen(1927, done);
  },
  stop: function(cb) {
    server.close(cb);
  }
};
