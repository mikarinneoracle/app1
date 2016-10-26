var users = [];

exports.getUsers = function(dbPool, callback) {

  process.nextTick(function() {

      dbPool.getConnection(function(err, connection) {
      if (err) {
        callback (new Error(err.message));
        return;
      }

      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('select id, name, phone, photo from phonebook',
      function(err, result) {
          if (err) {
            console.log(err.message);
            //callback (new Error(err.message));
            callback(null, users); // Fallback with users in memory
            connection.release();
            return;
          }
          connection.release();
          if(result)
          {
              console.log(result.rows);
              aUsers = new Array();
              for (var row = 0; row < result.rows.length; row++) {
                var id = result.rows[row][0];
                var name = result.rows[row][1];
                var phone = result.rows[row][2];
                var photo = result.rows[row][3];
                var user = { "id" : id, "name" : name, "phone" : phone, "photo" : photo};
                aUsers.push(user);
              }
              console.log(aUsers);
              callback(null, aUsers);
          }
          else {
              callback(null, users); // Fallback with users in memory
          }
      });
    });
  });
};

exports.getUser = function(id, callback) {

  process.nextTick(function() {

    // will explore *much* better ways of doing this in future sessions
    var i, user;

    for (i = 0; i < users.length; i++) {
      user = users[i];
      if (user.id === id) return callback(null, user);
    }

    // not found
    callback();

  });

};

exports.addUser = function(user, callback) {

  process.nextTick(function() {

    if (!user.name) return callback (new Error('missing user name'));
    if (!user.phone) return callback (new Error('missing user phone'));

    var id = (users.length + 1).toString();

    user.id = id;

    users.push(user);

    callback(null, user);

  });

};

exports.updateUser = function(user, callback) {

  process.nextTick(function() {

    if (!user.id) return callback (new Error('missing user id'));
    if (!user.name) return callback (new Error('missing user name'));
    if (!user.phone) return callback (new Error('missing user phone'));

    var i;
    for (i = 0; i < users.length; i++) {
      if (users[i].id == user.id)
      {
        users[i].name = user.name;
        users[i].phone = user.phone;
        user = users[i];
        return callback(null, user);
      }
    }

    // not found
    return callback (new Error('user not found with id ' + user.id));
    callback();

  });

};

exports.updateUserPhoto = function(user, callback) {

  process.nextTick(function() {

    if (!user.id) return callback (new Error('missing user id'));

    var i;
    for (i = 0; i < users.length; i++) {
      if (users[i].id == user.id)
      {
        users[i].photo = user.photo;
        user = users[i];
        return callback(null, user);
      }
    }

    // not found
    return callback (new Error('user not found with id ' + user.id));
    callback();

  });
};
