const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'shareyours';

// Use connect method to connect to the server
MongoClient.connect(
    url,
    {
        useNewUrlParser: true
    },
    function (err, db) {
        if (err) throw err;
        global.mongoConn = db.db(dbName)
    }
);
//Utilizamos una variable global que utilizamos en las querys
//" global.'variable' ", no exportamos en este caso como en MYSQL
