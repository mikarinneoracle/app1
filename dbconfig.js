
module.exports = {
  user          : process.env.NODE_ORACLEDB_USER || "mika",
  password      : process.env.NODE_ORACLEDB_PASSWORD || "pass",
  connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "140.86.0.141:1521/PDB1.gse00000504.oraclecloud.internal",
};
