const mysql = require("mysql2");  //ייבוא החבילה
const dbConfig = require("./db.config"); //ייבוא הקובץ
// Create a connection to the database
const connection = mysql.createConnection({
host: dbConfig.HOST,
user: dbConfig.USER,
password: dbConfig.PASSWORD,
database: dbConfig.DB
});
// open the MySQL connection
connection.connect(error => {
    if (error) throw error; //התמודדות אם לא מצליחים להתחבר לבסיס נתונים
    console.log("Successfully connected to the database.");
});
module.exports = connection;

