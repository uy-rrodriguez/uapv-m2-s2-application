/* ******************************************************************************************* *
    Server configuration
 * ******************************************************************************************* */

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

var app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/* ******************************************************************************************* *
    Database connection
 * ******************************************************************************************* */

function db_connect() {
  var db = new sqlite3.Database('./db/back-rest.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });
  return db;
}

function db_close(db) {
  db.close();
}

function db_create() {
  let db = db_connect();

  //db.run(`DROP TABLE IF EXISTS user`);
  db.run(`CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT)`);

  db_close(db);
}


/* ******************************************************************************************* *
    Handlers configuration
 * ******************************************************************************************* */

app.get('/index', function(req, res) {
  res.json({result: "It's alive!"})
});

app.post('/login', function(req, res, next) {
  console.log(req.body);

  /*
  if(!req.body.notes || typeof req.body.notes != "string") {
    res.status(400).send("400 Bad Request")
  }

  req.user.customData.notes = req.body.notes
  req.user.customData.save()
  res.status(200).end()
  */

  let sql =`SELECT id, name
            FROM user
            WHERE name = ? AND password = ?`;

  // Get first row only
  let db = db_connect();
  db.get(sql, [req.body.user, req.body.password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.json({result: false, error: err.message});
    }

    if (row)
      res.json({result: true, id: row.id, name: row.name});
    else
      res.json({result: false, error: `No user found with the given credentials`});
  });

  db_close(db);
});

app.post('/register', function(req, res) {
  console.log(req.body);

  let sql =`INSERT INTO user (name, password) VALUES (?, ?)`;

  let db = db_connect();
  db.run(sql, [req.body.user, req.body.password], (err) => {
    if (err) {
      console.error(err.message);
      res.json({result: false, error: err.message});
    }

    res.json({result: true, message: `The user has been successfully created`});
  });

  db_close(db);
});



/* ******************************************************************************************* *
    Server initialization
 * ******************************************************************************************* */

db_create();
app.listen(4000);