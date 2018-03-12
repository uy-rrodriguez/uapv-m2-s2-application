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
  /*
  if(!req.body.notes || typeof req.body.notes != "string") {
    res.status(400).send("400 Bad Request")
  }
  req.user.customData.notes = req.body.notes
  req.user.customData.save()
  res.status(200).end()
  */
  res.json({result: "It's alive!"});
});

app.post("/login", function(req, res) {
  try {
    auth.user().findOne({ where: {name: req.body.user}}).then(user => {
      if (!user) {
        res.json({result: false, message: "Unknows user !"});
      }
      else if (req.body.password != user.password) {
        res.json({result: false, message: "Invalid password !"});
      }
      else {
        auth.role().findOne({ where: {id: user.id_role}}).then(role => {
          if (!role) {
            res.json({result: false, message: "Unable to retrieve user's access !"});
          }
          else {
            res.json({result: true, user: {
                id: user.id,
                id_role: role.name,
                name: user.name,
                password: user.password,
                max_weight: user.max_weight
            }});
          }
        });
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
});

app.post("/signin", function(req, res) {
  try {
    auth.role().findOne({ where: {name: req.body.role}}).then(role => {
      if (!role) {
        res.json({result: false, message: "Unable to determine user's role !"});
      }
      else {
        auth.user().findOne({ where: {name: req.body.user}}).then(user => {
          if (user) {
            res.json({result: false, message: "Username is already existing !"});
          }
          else {
            result = auth.user().create({
              id_role: role.id, name: req.body.user, password: req.body.password, max_weight: req.body.maxWeight
            }).then(create => {
              if (!create) {
                res.json({result: false, message: "User creation failed !"});
              }
              else {
                res.json({result: true});
              }
            });
          }
        });
      }
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
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

////////////////////////////////////////////////////////////////////////////////
// PASSPORT DEFINITION /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  auth.User.find({where: {id: id}}).success(function(user){
    done(null, user);
  }).error(function(err){
    done(err, null);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    auth.User.find({ where: { name: name }}).success(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (password != user.password) {
        done(null, false, { message: 'Invalid password'});
      } else {
        done(null, user);
      }
    }).error(function(err){
      done(err);
    });
  }
));
*/

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