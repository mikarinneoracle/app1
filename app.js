var express = require('express'),
    app = express(),
    connect = require('./connect.js'),
    bodyParser = require('body-parser'),
    users = require('./lib/users');

module.exports = app;
app.use(bodyParser.json());

app.get('/connect', function(req, res) {

  connect.test(function(err, result) {
    if (err) {
      // just an example (we don't actually throw any errors in getUsers)
      return res.status(500).json( { success: false, reason: err.message });
    }

    res.send({ success: true, connect: result });
  });
});

app.get('/users', function(req, res) {

  users.getUsers(function(err, result) {
    if (err) {
      // just an example (we don't actually throw any errors in getUsers)
      return res.status(500).json( { success: false, reason: err.message });
    }

    res.send({ success: true, users: result });
  });

});

app.get('/users/:id', function(req, res) {
  var id = req.params.id;

  users.getUser(id, function(err, result) {
    if (err) {
      // just an example (bad request)
      return res.status(400).json( { success: false, reason: err.message });
    }

    if (!result) {
      return res.status(404).json( { success: false, reason: 'user id not found' });
    }

    res.send({ success: true, user: result });
  });

});

app.post('/users', function(req, res) {
  var user = req.body;

  console.log(user);

  users.addUser(user, function(err, result) {
    if (err) {
      // just an example (bad request) since the only error that we throw is if missing user name
      return res.status(400).json( { success: false, reason: err.message });
    }

    res.send({ success: true, user: result });
  });

});
