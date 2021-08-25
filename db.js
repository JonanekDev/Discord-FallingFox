const mysql = require("mysql");


//Create connection to mysql server
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    supportBigNumbers: true
})

//Connect to mysql
db.connect((err) => {
    if(err) {
        console.log("[FATAL ERROR] Nepodařilo se připojit na MySQL, zkontroluj .env soubor. Aplikace se automaticky vypne! MySQL err: " + err);
        process.exit(1);
    } else {
        console.log("[Start] Připojení na MySQL bylo úspěšné!!")
    }
    //Prevent MySQL server to end MySQL connection
    setInterval(() => {
        db.ping();
    }, 10 * 60 * 1000);
})

module.exports = db;