const mysql = require("mysql");
    function testDB(config,cb) {
        console.log(config, 1243);
        let {host,username,password,dbName,port} = config;
    let result = '';
    const connection = mysql.createConnection({
      host: host,
      user: username,
      password:password,
      database: dbName,
        port: port,
    })

    connection.connect(function(error) {
        if (error) {
            result = 'Database connection failed';
        } else {
            result = 'Database connected success';
        }
        cb(result) ;
    })

    connection.end();

}

module.exports = {
    testDB
};