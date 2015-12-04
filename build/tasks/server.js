var app        = require('express')(),
    bodyParser = require('body-parser'),
    cors       = require('cors'),
    server;

app.use(bodyParser.json());

app.use(cors());

app.all('*', function (req, res) {
  res.send({
    path  : req.path,
    query : req.query,
    body  : req.body,
    method: req.method
  });
});

module.exports = {
  start: function (done) {
    server = app.listen(1927, done);
  },
  stop : function () {
    server.close();
  }
};
