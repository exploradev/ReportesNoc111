var mysql = require('mysql');
var db_tmk;

function connectDatabaseTMK() {
    if (!db_tmk) {
        db_tmk = mysql.createPool({
            connectionLimit: 150,
            host: 'localhost',
            user: 'explora264', password: '3.1415927',
            //user: 'root', password: 'root',
            database: 'exploratmk'
        });
    }
    return db_tmk;
}

module.exports = connectDatabaseTMK();