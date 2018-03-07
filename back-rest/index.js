/* ******************************************************************************************* *
    Server configuration
 * ******************************************************************************************* */

let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let db = require("./lib/db");

let app = express();

let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/* ******************************************************************************************* *
    Handlers configuration
 * ******************************************************************************************* */

app.get("/index", function(req, res) {
  res.json({result: "It's alive!"});
});

app.post("/login", function(req, res, next) {
  //console.log(req.body);

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
  try {
    let dbconn = db.connect();
    dbconn.get(sql, [req.body.user, req.body.password], (err, row) => {
      try {
        if (err) {
          throw err;
        }

        if (row) {
          res.json({result: true, id: row.id, name: row.name});
        }
        else {
          throw "No user found with the given credentials";
        }
      }
      catch (e) {
        res.json({result: false, error: e.message});
      }
    });
  }
  catch(e) {
    res.json({result: false, error: e.message});
  }
});

app.post("/register", function(req, res) {
  //console.log(req.body);

  let sql ="INSERT INTO user (name, password) VALUES (?, ?)";

  try {
    let dbconn = db.connect();
    dbconn.run(sql, [req.body.user, req.body.password], (err) => {
      try {
        if (err) {
          throw err;
        }

        res.json({result: true, message: "The user has been successfully created"});
      }
      catch (e) {
        res.json({result: false, error: e.message});
      }
    });
  }
  catch(e) {
    res.json({result: false, error: e.message});
  }
});



/* ******************************************************************************************* *
    Database creation
 * ******************************************************************************************* */

db.connect();
db.createTables();
db.close();



/* ******************************************************************************************* *
    Server initialization
 * ******************************************************************************************* */

app.listen(4000);