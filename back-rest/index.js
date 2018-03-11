/* ******************************************************************************************* *
    Server configuration
 * ******************************************************************************************* */

let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let db = require("./lib/db");
let auth = require("./lib/auth.js");

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

  let sql = `SELECT id, name
            FROM "user"
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

app.post("/signin", function(req, res) {
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

app.get('/logout', function(req, res) {
  res.json({result: false, message: "Not yet implemented."});
});

app.get('/ordergroup', function(req, res) {
  let sql1 = `INSERT INTO "order_group"(id_user, total_weight) VALUES (?, ?)`;
  let sql2 = `SELECT * FROM "order_group" ORDER BY id DESC`;
  let sql3 = `SELECT "order".*
              FROM "order"
              INNER JOIN "order_status" ON "order".id_order_status = "order_status".id
              WHERE "order_status".id = ?`;
  let sql4 = `INSERT INTO "order_group_line"(id_order_group, id_order)`;
  let sql5 = `UPDATE "order_group" SET total_weight = ? WHERE id = ?`;
  let conn;
  let params = [];
  let id;
  let total_weight = 0;
  try {
    conn = db.connect();
    conn.run(sql1, [1, 0], function(err) {
      if (err) {
        res.json({result: false, message: err.message});
      }
      else {
        conn.get(sql2, function(err, row) {
          if (err) res.json({result: false, message: err.message});
          if (row) {
            id = row.id;
            conn.all(sql3, [2], function(err, rows) {
              if (err) res.json({result: false, message: err.message});
              if (rows) {
                sql4 += ` VALUES `;
                for (var i = 0; i < rows.length; i++) {
                  if (i > 0) {
                    sql4 += `, `;
                  }
                  sql4 += `(?, ?)`;
                  params.push(id);
                  params.push(rows[i].id);
                }
                conn.run(sql4, params, function(err) {
                  if (err) {
                    res.json({result: false, message: err.message});
                  }
                  else {
                    res.json({result: true});
                  }
                });
              }
            });
          }
          else {
            res.json({result: false, message: "Unable to create order group !"});
          }
        });
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.put('/ordergroup/:id', function(req, res) {
  let sql1 = `SELECT * FROM "order_status" WHERE name = ?`;
  let sql2 = `SELECT "order_group_line".*
            FROM "order_group"
            INNER JOIN "order_group_line" ON "order_group".id = "order_group_line".id_order_group
            WHERE "order_group".id = ?`;
  let sql3 = `UPDATE "order" SET id_order_status = ?`;
  let conn;
  let params = [];
  try {
    conn = db.connect();
    conn.serialize(function() {
      conn.get(sql1, [req.body.status], function(err, row) {
        if (err) res.json({result: false, message: err.message});
        if (row) {
          params.push(row.id);
          conn.all(sql2, [req.params.id], function(err, rows) {
            if (err) res.json({result: false, message: err.message});
            if (rows) {
              sql3 += ` WHERE id IN (`;
              for (var i = 0; i < rows.length; i++) {
                if (i > 0) {
                  sql3 += `, `;
                }
                sql3 += `?`;
                params.push(rows[i].id_order);
              }
              sql3 += `)`;
              conn.run(sql3, params, function(err) {
                if (err) {
                  res.json({result: false, message: err.message});
                }
                else {
                  res.json({result: true});
                }
              });
            }
            else {
              res.json({result: false, message: "Unable to retrieve each order !"});
            }
          });
        }
        else {
          res.json({result: false, message: "Unable to retrieve specified status !"});
        }
      });
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.post('/alert', function(req, res) {
  let sql1 = `INSERT INTO "alert"(id_product, id_alert_status, stock) VALUES(
    ?, 2, ?)`;
  let conn;
  try {
    conn = db.connect();
    conn.run(sql1, [req.body.id_product, req.body.stock], function(err) {
      if (err) {
        res.json({result: false, message: err.message});
      }
      else {
        res.json({result: true});
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.get('/alert', function(req, res) {
  let sql1 = `SELECT * FROM "alert"`;
  let conn;
  try {
    conn = db.connect();
    conn.all(sql1, function(err, rows) {
      if (err) res.json({result: false, message: err.message});
      if (rows) {
        res.json({result: true, alerts: rows});
      }
      else {
        res.json({result: false, message: "Unable to get alert list !"});
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.delete('/alert/:id', function(req, res) {
  let sql1 = `SELECT * FROM "alert" WHERE id = ?`;
  let sql2 = `UPDATE "product" SET stock = ? WHERE id = ?`;
  let sql3 = `UPDATE "alert" SET id_alert_status = ? WHERE id = ?`;
  let conn;
  try {
    conn = db.connect();
    conn.serialize(function() {
      conn.get(sql1, [req.params.id], function(err, row) {
        if (err) res.json({result: false, message: err.message});
        if (row) {
          conn.run(sql2, [req.body.stock, row.id_product], function(err) {
            if (err) res.json({result: false, message: err.message});
          });
          conn.run(sql3, [1, row.id], function(err) {
            if (err) {
              res.json({result: false, message: err.message});
            }
            else {
              res.json({result: true});
            }
          });
        }
        else {
          res.json({result: false, message: "Unable to retrieve specified alert !"});
        }
      });
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.get('/ordergrouplist', function(req, res) {
  let sql = `SELECT "order_group".*, "order_group_line".*, "order".*
            FROM "order_group"
            INNER JOIN "order_group_line" ON "order_group".id = "order_group_line".id_order_group
            INNER JOIN "order" ON "order_group_line".id_order = "order".id
            ORDER BY "order".date DESC`;
  let conn;
  try {
    conn = db.connect();
    conn.all(sql, [], function(err, rows) {
      if (err) res.json({result: false, message: err.message});
      if (rows) {
        res.json({result: true, orders: rows});
      }
      else {
        res.json({result: false, message: "Unable to retrieve all order group !"});
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.get('/setup', function(req, res) {
  try {
    db.connect();
    //db.dropTables();
    //db.createTables();
    db.insertData();
    res.json({result: true});
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
  finally {
    db.close();
  }
});

app.get('/test', function(req, res) {
  //res.json({result: false, message: "Not yet implemented !"});
  res.json({user: auth.test()});
});

try {
  // SI CES FONCTIONS NE SONT PAS APPELEES, LES METHODES DE L'API PLANTENT
  // TROUVER UNE SOLUTION POUR LES SUPPRIMER
  db.connect();
  //db.dropTables();
  db.createTables();
  //db.insertData();
  db.close();
  auth.authenticate();
}
catch (e) {
  console.log(e.message);
}



/* ******************************************************************************************* *
    Server initialization
 * ******************************************************************************************* */

app.listen(4000);