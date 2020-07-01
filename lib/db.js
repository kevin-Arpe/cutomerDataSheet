const mysql = require('mysql');
module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '105501',
    database: 'sqltutorial'
});d