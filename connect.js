var PORT = process.env.PORT || 8080;
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var connection;

testConnection();

function testConnection()
{
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
        return;
     }
     console.log("Connected to " + dbConfig.connectString);
     connection = conn;
     doRelease();
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
