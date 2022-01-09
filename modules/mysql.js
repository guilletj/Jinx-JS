const mysql = require('mysql');
const { cfg } = require('./configLoader.js');

console.log('Trying to connect to MySQL...')
const db = mysql.createConnection({
	host: cfg.database.host,
	user: cfg.database.user,
	password: cfg.database.password,
	database: cfg.database.database
});

db.connect(function(err) {
	if (err) {
		console.log(err.code);
		console.log(err.fatal);
		console.log('Failed to connect to MySQL')
	} else {
		console.log('Connection to MySQL OK...')
	}
})

module.exports = {
	db
}