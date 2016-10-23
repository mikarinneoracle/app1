var http = require('http');
var express = require('express');
var multer  =   require('multer');
var bodyParser = require('body-parser');
var port = process.env.PORT;
var app = express();
var connect = require('./lib/connect.js');
var users = require('./lib/users.js');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', function(req,res){
	res.send('index.html')
})

app.get('/connect', function(req, res) {

  connect.test(function(err, result) {
    if (err) {
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

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
		console.log(req.body.user);
		console.log(file);
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
		console.log(req.body.user);
		callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
					  console.log(err);
						res.redirect('/#/add');
            return;
        }
        console.log("File is uploaded");
				res.redirect('/#/add');
    });
});

app.post('/users', function(req, res) {
  var user = req.body;

  if(user.id)
	{
		users.updateUser(user, function(err, result) {
		if (err) {
	      // just an  example (bad request) since the only error that we throw is if missing user name
	      return res.status(400).json( { success: false, reason: err.message });
	    }

	    res.send({ success: true, user: result });
	  });
	} else {
	  users.addUser(user, function(err, result) {
		if (err) {
	      // just an  example (bad request) since the only error that we throw is if missing user name
	      return res.status(400).json( { success: false, reason: err.message });
	    }

	    res.send({ success: true, user: result });
	  });
	}

});

app.listen(port, function() {
  console.log('server listening on port ' + port);
});
