var PORT = process.env.PORT || 8080;
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var connection;

exports.test = function testConnection(callback)
{
  process.nextTick(function() {
    console.log("Testing connection ..");
    oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    function(err, conn) {
      if (err) {
          console.error(err.message);
          callback(null, err.message + ' ' + dbConfig.connectString);
       }
       console.log("Connected to " + dbConfig.connectString);
       connection = conn;
       doRelease();
       callback(null, "OK");
    });
  });
}

function doRelease()
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
      console.log("Disconnected.");
    });
}
