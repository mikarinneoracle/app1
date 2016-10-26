var PORT = process.env.PORT || 8080;
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var dbPool;

exports.getPool = function getPool(callback)
{
  process.nextTick(function() {
    callback(null, dbPool);
  });
}

exports.test = function testConnection(callback)
{
  process.nextTick(function() {
    var i;
    var error;
    console.log("Testing connection ..");
    dbPool.getConnection(
    function(err, connection) {
      if (err) {
          console.error(err.message);
          callback (new Error(err.message + ' ' + (dbConfig.connectString ? dbConfig.connectString : '')));
          return;
       }
       console.log("Connected to " + dbConfig.connectString);
       if(connection) doRelease(connection);
       callback(null, dbConfig.connectString);
    });
  });
}

function doRelease(connection)
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
      console.log("Disconnected.");
    });
}

oracledb.createPool(
{
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString,
    poolMax: 5, // maximum size of the pool
    poolMin: 0, // let the pool shrink completely
    poolIncrement: 1, // only grow the pool by one connection at a time
    poolTimeout: 0  // never terminate idle connections
},
function(err, pool) {
  if (err) {
    console.error("createPool() error: " + err.message);
    return;
  }
  dbPool = pool;
  console.log("DB connection pool created");
  console.log(dbPool);
});
