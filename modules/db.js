var mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 150,
            host: 'localhost',
            user: 'explora264', password: '3.1415927',
            //user: 'root', password: 'root',
            database: 'ReportesNoc111'
        });
    }
    return db;
}

module.exports = connectDatabase();