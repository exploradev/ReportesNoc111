var mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 1000,
            host: 'localhost',
            user: 'explora264', password: '3.1415927',
            //user: 'root', password: 'root',
            database: 'Explora264'
        });
    }
    return db;
}

module.exports = connectDatabase();