exports.getPhotos = function(dbPool, fs, callback) {

  process.nextTick(function() {

      dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        callback (new Error(err.message));
        return;
      }

      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('select name, data from photo',
      function(err, result) {
          if (err) {
            console.log(err.message);
            connection.release();
            callback (new Error(err.message));
            return;
          }
          if(result)
          {
              console.log('Found ' + result.rows.length + ' photos.');
              var photos = [];
              for (var row = 0; row < result.rows.length; row++) {
                var name = result.rows[row][0];
                var data = result.rows[row][1];
                var photo = { "name" : name, "size" : data.length };
                console.log(data);
                photos.push(photo);
                console.log(name + ', size: ' + data.length);
                fs.writeFile('./uploads/' + name, decodeBase64Image(data), 'binary', function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(name + ' saved.');
                    }
                });
              }
              connection.release();
              callback(null, photos);
          } else {
            connection.release();
            callback(null, null);
          }
      });
    });
  });
};

exports.setPhotos = function(dbPool, fs, callback) {

  process.nextTick(function() {

      dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        callback (new Error(err.message));
        return;
      }

      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('select photo from phonebook where photo is not null',
      function(err, result) {
          if (err) {
            console.log(err.message);
            connection.release();
            callback (new Error(err.message));
            return;
          }
          connection.release();
          if(result)
          {
              console.log(result);
              console.log('Found ' + result.rows.length + ' photos.');
              var photos = [];
              for (var row = 0; row < result.rows.length; row++) {
                var name = result.rows[row][0];
                console.log("NAME " + name);
                getPhoto(dbPool, fs, name, function(err, data)
                {
                  if (err) {
                    console.log("ERROR " + err.message);
                    callback (err);
                    return;
                  }
                  var photo = { "name" : name, "size" : data.length };
                  console.log(data);
                  photos.push(photo);
                });
              }
              callback(null, photos);
          } else {
            callback(null, null);
          }
      });
    });
  });
};

function addPhoto(dbPool, photo, callback) {

  process.nextTick(function() {

    if (!photo.name) return callback (new Error('missing photo name'));
    if (!photo.data) return callback (new Error('missing photo data'));

    dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        connection.release();
        callback (new Error(err.message));
        return;
      }

      var name = photo.name;
      var data = photo.data;

      console.log(data.length);
      console.log(name);

      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('insert into photo(name, data) values (:name, :data)',
      {
          name: name,
          data: data
      },
      { autoCommit: true },
      function(err, result) {
          if (err) {
            console.log(err.message);
            connection.release();
            callback (new Error(err.message));
            return;
          }
          connection.release();
          var photo = { "name" : name, "data" : data };
          callback(null, photo);
      });

    });
  });
};

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

function encodeBase64Image(data) {
    return new Buffer(data).toString('base64');
}

function getPhoto(dbPool, fs, name, callback)
{
  var fileName = "./uploads/" + name;
  console.log("Reading " + fileName);
  fs.readFile(fileName, 'binary', function (err,data)
  {
    if (err) {
      console.log(err);
      callback (new Error("file " + fileName + " not found"));
    }
    var photo = [];
    photo.name = name;
    photo.data = encodeBase64Image(data);
    console.log("Saving " + name);
    console.log(photo.data);
    addPhoto(dbPool, photo, function(err, result) {
      if (err) {
        console.log(err);
        callback(err);
      }
      callback(null, photo);
    });
  });
}
