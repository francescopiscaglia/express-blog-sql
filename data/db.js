const mysql = require("mysql2");

// mysql config
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'password',
    database: 'blog_db'
});

// connect to db
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

module.exports = connection;