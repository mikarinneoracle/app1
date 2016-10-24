var users = [];

exports.getUsers = function(callback) {

  process.nextTick(function() {
    callback(null, users);
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

    console.log(user);

    if (!user.id) return callback (new Error('missing user id'));
    if (!user.name) return callback (new Error('missing user name'));
    if (!user.phone) return callback (new Error('missing user phone'));

    var i;
    for (i = 0; i < users.length; i++) {
      if (users[i].id === user.id)
      {
        users[i].name = user.name;
        users[i].phone = user.phone;
        user = users[i];
        return callback(null, user);
      }
    }

    // not found
    callback();

  });

};

exports.updateUserPhoto = function(user, callback) {

  process.nextTick(function() {

    console.log(user);

    if (!user.id) return callback (new Error('missing user id'));

    var i;
    for (i = 0; i < users.length; i++) {
      if (users[i].id === user.id)
      {
        users[i].photo = user.photo;
        user = users[i];
        return callback(null, user);
      }
    }

    // not found
    callback();

  });
};
