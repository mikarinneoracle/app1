var express = require('express');
var multer  =   require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var swaggerJSDoc = require('swagger-jsdoc');
var port = process.env.PORT;
var app = express();
var connect = require('./lib/connect.js');
var users = require('./lib/users.js');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', function(req,res){
	res.send('index.html')
})

/**
 * @swagger
 * /connect:
 *   get:
 *     tags:
 *       - DB Pool
 *     description: Tests database pool connection configured to the server
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the connect string when successful
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            connect:
 *               type: string
 *       500:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */

app.get('/connect', function(req, res) {

  connect.test(function(err, result) {
    if (err) {
      return res.status(500).json( { success: false, reason: err.message });
    }

    res.send({ success: true, connect: result });
  });
});

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       phone:
 *         type: string
 *       photo:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            users:
 *               type: array
 *               items: {
 *                  "$ref": "#/definitions/User"
 *               }
 *       400:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */
app.get('/users', function(req, res) {

  connect.getPool(function(err, dbPool) {
		if(err)
		{
			return res.status(500).json( { success: false, reason: 'could not get pool' });
		}
	  users.getUsers(dbPool, function(err, result) {
	    if (err) {
	      return res.status(500).json( { success: false, reason: err.message });
	    }

	    res.send({ success: true, users: result });
	  });
	});

});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Users's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A user if found
 *         schema:
 *           properties:
 *            success:
 *              type: boolean
 *            user:
 *              "$ref": "#/definitions/User"
 *       404:
 *         description: Not found
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 *       400:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */

 app.get('/users/:id', function(req, res) {
  var id = req.params.id;
  connect.getPool(function(err, dbPool) {
 	if(err)
 	{
 		return res.status(500).json( { success: false, reason: 'could not get pool' });
 	}
 	users.getUser(dbPool, id, function(err, result) {
 		if (err) {
 			return res.status(400).json( { success: false, reason: err.message });
 		}
		if (!result) {
      return res.status(404).json( { success: false, reason: 'user id not found' });
    }
 		res.send({ success: true, user: result });
 	});
 });
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
		var tokens = file.originalname.split(".");
		var filename = req.body.user + "." + (tokens.length == 2 ? tokens[1] : "");
		var user = [];
		user.id = req.body.user;
		user.photo = filename;
		connect.getPool(function(err, dbPool) {
		 	if(err)
		 	{
		 		return res.status(500).json( { success: false, reason: 'could not get pool' });
		 	}
			users.updateUserPhoto(dbPool, user, function(err, result) {
				if (err) {
			  	console.log(err);
			  }
			});
		});
		callback(null, filename); // replaces the file.originalname
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
					  console.log(err);
						res.redirect('/#/');
            return;
        }
				res.redirect('/#/');
    });
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Inserts a single user or updates if ID given. Please use the fields in User json.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Json containing the user data. If contains ID will update, otherwise will insert. Photo won't be updated even if given, please use the photos -service.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Inserted or updated user
 *         schema:
 *           properties:
 *            success:
 *              type: boolean
 *            user:
 *              "$ref": "#/definitions/User"
 *       400:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */

app.post('/users', function(req, res) {
  var user = req.body;

	connect.getPool(function(err, dbPool) {
	 	if(err)
	 	{
	 		return res.status(500).json( { success: false, reason: 'could not get pool' });
	 	}
	  if(user.id)
		{
			users.updateUser(dbPool, user, function(err, result) {
			if (err) {
		      return res.status(400).json( { success: false, reason: err.message });
		    }
		    res.send({ success: true, user: result });
		  });
		} else {
		  users.addUser(dbPool, user, function(err, result) {
			if (err) {
		      return res.status(400).json( { success: false, reason: err.message });
		    }
		    res.send({ success: true, user: result });
		  });
		}
 });
});

/**
 * @swagger
 * /photos:
 *   post:
 *     tags:
 *       - Photos
 *     description: Adds a photo in the base-64 format to a user identified by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: photo
 *         description: Json containing the user id and photo in base-64 format
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Name of the image added for the user
 *         schema:
 *           properties:
 *            success:
 *              type: boolean
 *            image:
 *              type: string
 *       400:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */

app.post('/photos/',function(req,res) {
	var user = req.body;
	var imageBuffer = decodeBase64Image(user.photo);
	var type = imageBuffer.type.split('/')[1];
	user.photo = user.id + "." + type;
	var fileName = "./uploads/" + user.photo;
	connect.getPool(function(err, dbPool) {
	 	if(err)
	 	{
	 		return res.status(500).json( { success: false, reason: 'could not get pool' });
	 	}
		users.updateUserPhoto(dbPool, user, function(err, result) {
			if (err) {
				return res.status(400).json( { success: false, reason: err.message });
			}
			fs.writeFile(fileName, imageBuffer.data), function(err) {
				return res.status(400).json( { success: false, reason: err.message });
			}
			res.send({ success: true, image: user.photo });
		});
	});
});

function decodeBase64Image(dataString)
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = [];

  if (matches.length !== 3)
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     tags:
 *       - Photos
 *     description: Deletes user's photo based on given user ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Users's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Status success if user found and delete successful
 *         schema:
 *           properties:
 *            success:
 *              type: boolean
 *       400:
 *         description: Error
 *         schema:
 *           properties:
 *            success:
 *               type: boolean
 *            reason:
 *               type: string
 */

app.delete('/photos/:id', function(req, res) {
	var user = [];
	user.id = req.params.id;
	user.photo = "";
	connect.getPool(function(err, dbPool) {
		if(err)
		{
			return res.status(500).json( { success: false, reason: 'could not get pool' });
		}
		users.updateUserPhoto(dbPool, user, function(err, result) {
			if (err) {
				return res.status(400).json( { success: false, reason: err.message });
			}
			res.send({ success: true });
		});
	});
});

app.listen(port, function() {
  console.log('server listening on port ' + port);
});

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Phonebook RESTful API with Swagger',
  },
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
