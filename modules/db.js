var mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 1000,
            host: 'localhost',
            user: 'exploratmk', password: '3.1415927',
            //user: 'root', password: 'root',
            database: 'exploratmk'
        });
    }
    return db;
}

module.exports = connectDatabase();