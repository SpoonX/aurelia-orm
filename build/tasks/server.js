var app           = require('express')();
var bodyParser    = require('body-parser');
var cors          = require('cors');
var autoIncrement = 1;
var server;

app.use(bodyParser.json());

app.use(cors());

app.post('/withassociations', function(req, res) {
  var built = req.body;

  built.id     = autoIncrement++;
  built.bar.id = autoIncrement++;

  res.send(built);
});

app.post('/foo', function(req, res) {
  var built = req.body;

  built.id = autoIncrement++;

  res.send(built);
});

app.post('/custom', function(req, res) {
  var built = req.body;

  built.id = autoIncrement++;

  res.send(built);
});

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
  stop : function(cb) {
    server.close(cb);
  }
};
