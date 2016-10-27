var users = [];

exports.getUsers = function(dbPool, callback) {

  process.nextTick(function() {

      dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        callback (new Error(err.message));
        return;
      }

      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('select id, name, phone, photo from phonebook',
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
              //console.log(result.rows);
              aUsers = new Array();
              for (var row = 0; row < result.rows.length; row++) {
                var id = result.rows[row][0];
                var name = result.rows[row][1];
                var phone = result.rows[row][2];
                var photo = result.rows[row][3];
                var user = { "id" : id, "name" : name, "phone" : phone, "photo" : photo};
                aUsers.push(user);
              }
              //console.log(aUsers);
              callback(null, aUsers);
          }
      });
    });
  });
};

exports.getUser = function(dbPool, id, callback) {

  process.nextTick(function() {

    var user;

    dbPool.getConnection(function(err, connection) {
    if (err) {
      console.log(err.message);
      connection.release();
      callback (new Error(err.message));
      return;
    }

    console.log("Connections open: " + dbPool.connectionsOpen);
    console.log("Connections in use: " + dbPool.connectionsInUse);

    connection.execute('select id, name, phone, photo from phonebook where id = :id',
    {
        id: id
    },
    function(err, result) {
        if (err) {
          console.log(err.message);
          connection.release();
          //callback (new Error(err.message));
          var i;
          for (i = 0; i < users.length; i++) {
            user = users[i];
            if (user.id === id) return callback(null, user); // Fallback with users in memory
          }
          // not found
          callback();
          return;
        }
        connection.release();
        if(result)
        {
            for (var row = 0; row < result.rows.length; row++) {
              var id = result.rows[row][0];
              var name = result.rows[row][1];
              var phone = result.rows[row][2];
              var photo = result.rows[row][3];
              user = { "id" : id, "name" : name, "phone" : phone, "photo" : photo};
            }
            if(user)
            {
                callback(null, user);
            } else {
                callback(); // Not found
            }
        }
      });
    });
  });
};

exports.addUser = function(dbPool, user, callback) {

  process.nextTick(function() {

    if (!user.name) return callback (new Error('missing user name'));
    if (!user.phone) return callback (new Error('missing user phone'));

    dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        connection.release();
        callback (new Error(err.message));
        return;
      }

      var name = user.name;
      var phone = user.phone;
      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('select phonebook_seq.nextval from dual',
      function(err, result) {
          if (err) {
            console.log(err.message);
            connection.release();
            callback (new Error(err.message));
            return;
          }
          var id = result.rows[0][0]; // If no error, excpect a value being returned

          connection.execute('insert into phonebook(id, name, phone) values (:id, :name, :phone)',
          {
              id: id,
              name: name,
              phone: phone
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
              var user = { "id" : id, "name" : name, "phone" : phone};
              callback(null, user);
          });

      });
    });
  });
};

exports.updateUser = function(dbPool, user, callback) {

  process.nextTick(function() {

    if (!user.id) return callback (new Error('missing user id'));
    if (!user.name) return callback (new Error('missing user name'));
    if (!user.phone) return callback (new Error('missing user phone'));

    dbPool.getConnection(function(err, connection) {
      if (err) {
        console.log(err.message);
        connection.release();
        callback (new Error(err.message));
        return;
      }

      var id = user.id;
      var name = user.name;
      var phone = user.phone;
      console.log("Connections open: " + dbPool.connectionsOpen);
      console.log("Connections in use: " + dbPool.connectionsInUse);

      connection.execute('update phonebook set id = :id, name = :name , phone = :phone where id = :id',
      {
          name: name,
          phone: phone,
          id: id
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
          var user = { "id" : id, "name" : name, "phone" : phone};
          callback(null, user);
      });

    });

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
