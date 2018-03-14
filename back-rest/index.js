/* ******************************************************************************************* *
    Server configuration
 * ******************************************************************************************* */

let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let db = require("./lib/db.js");
let dbManager = require("./lib/db-manager.js");

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
    dbManager.user().findOne({ where: {name: req.body.user}}).then(user => {
      if (!user) {
        res.json({result: false, message: "Unknown user !"});
      }
      else if (req.body.password != user.password) {
        res.json({result: false, message: "Invalid password !"});
      }
      else {
        dbManager.role().findOne({ where: {id: user.id_role}}).then(role => {
          if (!role) {
            res.json({result: false, message: "Unable to retrieve the user role data !"});
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
    dbManager.role().findOne({ where: {name: req.body.role}}).then(role => {
      if (!role) {
        res.json({result: false, message: "Unable to determine the role of the user !"});
      }
      else {
        dbManager.user().findOne({ where: {name: req.body.user}}).then(user => {
          if (user) {
            res.json({result: false, message: "Another user already exists with the same name !"});
          }
          else {
            result = dbManager.user().create({
              id_role: role.id, name: req.body.user, password: req.body.password, max_weight: req.body.maxWeight
            }).then(create => {
              if (!create) {
                res.json({result: false, message: "The user creation has failed !"});
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

app.get('/user', function(req, res) {
  try {
    dbManager.user().findAll({
      include: [dbManager.role()]
    }).then(users => {
      if (!users) res.json({result: false, message: "Unable to get the user list"});
      else res.json({result: true, users: users});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
});

app.get('/ordergroup', function(req, res) {
  generateOrders();
  let userId = 1;
  let orderGroupId = 0;
  
  try {
    dbManager.sequelize.transaction(function(t) {
      return dbManager.user().findOne({
        where: {
          id: userId
        }
      }, {
        transaction: t
      }).then(user => {
        return dbManager.orderGroup().create({
          id_user: user.id,
          total_weight: 0
        }, {
          transaction: t
        }).then(orderGroup => {
          
          orderGroupId = orderGroup.id;
          
          return dbManager.order().findAll({
            where: {
              id_order_status: 2
            },
            include: [{
              model: dbManager.orderLine(),
              as: 'order_line',
              include: [{
                model: dbManager.product()
              }]
            }]
          }).then(orders => {
            let data = [];
            let total_weight = 0;
            let ids = [];
            for (let i = 0; i < orders.length; i++) {
              let lines_weight = 0;
              for (let j = 0; j < orders[i].order_line.length; j++) {
                lines_weight += orders[i].order_line[j].product.weight;
              }
              if ((total_weight + lines_weight) < user.max_weight) {
                data.push({
                  id_order_group: orderGroup.id,
                  id_order: orders[i].id
                });
                total_weight += lines_weight;
                ids.push(orders[i].id);
              }
            }
            return dbManager.orderGroupLine().bulkCreate(data, {
              transaction: t
            }).then(() => {
              return dbManager.orderGroup().update({
                total_weight: total_weight
              }, {
                where: {
                  id: orderGroup.id
                },
                transaction: t
              }).then(() => {
                return dbManager.order().update({
                  id_order_status: 3
                }, {
                  where: {
                    id: {
                      [dbManager.Op.in]: ids
                    }
                  },
                  transaction: t
                });
              });
            });
          })
        });
      });
    })
    
    .then(function(result) {
      console.log('\nRESULT:\n' + result + '\n');
      
      dbManager.orderGroup().findOne({
        where: {
          id: orderGroupId
        },
        include: [dbManager.user(), {
          model: dbManager.orderGroupLine(),
          as: 'order_group_line',
          include: [{
            model: dbManager.order(),
            include: [dbManager.orderStatus(), {
              model: dbManager.orderLine(),
              as: 'order_line',
            }]
          }]
        }]
      })
      .then((orderGroup) => {
        res.json({result: true, orderGroup: orderGroup});
      })
      .catch((err) => {
        console.log('\nERR:\n' + err.message + '\n');
        res.json({result: false, message: 'Unable to retrieve the group of orders after creation !'});
      });
    })
    
    .catch(function(err) {
      console.log('\nERR:\n' + err.message + '\n');
      res.json({result: false, message: 'An error occured ! Unable to complete the processing !'});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
});

app.get('/ordergroup/:id', function(req, res) {
  try {      
    dbManager.orderGroup().findOne({
      where: {
        id: req.params.id
      },
      include: [dbManager.user(), {
        model: dbManager.orderGroupLine(),
        as: 'order_group_line',
        include: [{
          model: dbManager.order(),
          include: [dbManager.orderStatus(), {
            model: dbManager.orderLine(),
            as: 'order_line',
          }]
        }]
      }]
    })
    .then((orderGroup) => {
      res.json({result: true, orderGroup: orderGroup});
    })
    .catch((err) => {
      console.log('\nERR:\n' + err.message + '\n');
      res.json({result: false, message: 'Unable to retrieve the group of orders with the given ID !'});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
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
              for (let i = 0; i < rows.length; i++) {
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
              res.json({result: false, message: "Unable to retrieve the orders !"});
            }
          });
        }
        else {
          res.json({result: false, message: "Unable to retrieve the specified status !"});
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
  try {
    dbManager.alert().findAll({
      where: {id_alert_status: 2},
      include: [dbManager.product(), dbManager.alertStatus()]
    }).then(alerts => {
      if (!alerts) res.json({result: false, message: "Unable to get the alert list"});
      else res.json({result: true, alerts: alerts});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
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
          res.json({result: false, message: "Unable to retrieve the specified alert !"});
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
  try {
    dbManager.orderGroup().findAll({
      include: [dbManager.user(), {
        model: dbManager.orderGroupLine(),
        as: 'order_group_line',
        include: [{
          model: dbManager.order(),
          include: [dbManager.orderStatus(), {
            model: dbManager.orderLine(),
            as: 'order_line',
          }]
        }]
      }]
    }).then(orderGroups => {
      if (!orderGroups) res.json({result: false});
      else res.json({result: true, order_group: orderGroups});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
});

app.get('/product/:id', function(req, res) {
  let productId = req.params.id;
  try {
    dbManager.product().findOne({
      where: {
        id: productId
      },
      include: [{
          model: dbManager.rack(),
          include: [dbManager.section()]
      }]
    }).then(product => {
      if (!product) res.json({result: false, message: 'Unable to retrieve a product with the specified ID !'});
      else res.json({result: true, product: product});
    });
  }
  catch (e) {
    res.json({result: false, message: e.message});
  }
});

app.get('/setup', function(req, res) {
  try {
    db.connect();
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
  dbManager.test();
  res.json({result: true});
});

app.get('/generate', function(req, res) {
  generateOrders();
  res.json({result: true});
});

function generateOrders() {
  let nbOrders = 10;
  let maxNbLines = 4;
  let maxQuantity = 10;
  let maxProductId = 6;
  /*
  let executed = 0;
  */
  try {
    for (let i = 0; i < nbOrders; i++) {
      dbManager.sequelize.transaction(function(t) {
        return dbManager.product().findAll({}, {
          transaction: t
        }).then(products => {
          let date = new Date();
          let month = date.getMonth() + 1;
          if (month < 10) month = '0' + month;
          let day = date.getDate();
          if (day < 10) day = '0' + day;
          return dbManager.order().create({
            client: 'generatedTest',
            date: date.getFullYear()
                    + '-' + month
                    + '-' + day
                    + ' ' + date.getHours()
                    + ':' + date.getMinutes()
                    + ':' + date.getSeconds(),
            id_order_status: 2
          }, {
            transaction: t
          }).then(order => {
            let nbLines = Math.floor(Math.random() * (maxNbLines - 1 + 1)) + 1;
            let data = [];
            /*
            let ids = [];
            let stock = [];
            let alert = false;
            */
            for (let j = 0; j < nbLines; j++) {
              let quantity = Math.floor(Math.random() * (maxQuantity - 1 + 1)) + 1;
              let productId = Math.floor(Math.random() * (maxProductId - 1 + 1)) + 1;
              /*
              for (let k = 0; k < products.length; k++) {
                if (productId == products[k].id) {
                  if (products[k].stock == 0) {
                    throw new Error('Product stock for id (' + productId+ ') is empty !');
                  }
                  else if (quantity > products[k].stock) {
                    quantity = products[k].stock;
                    //
                    ids.push(products[k].id);
                    stock.push({
                      stock: 0
                    });
                    alert = true;
                    //
                  }
                  else if ((products[k].stock - quantity) <= 10) {
                    //
                    ids.push(products[k].id);
                    stock.push({
                      stock: products[k].stock - quantity
                    });
                    alert = true;
                    //
                  }
                  else {
                    //
                    ids.push(products[k].id);
                    stock.push({
                      stock: products[k].stock - quantity
                    });
                    //
                  }
                }
              }
              */
              data.push({
                quantity: quantity,
                id_order: order.id,
                id_product: productId
              });
            }
            return dbManager.orderLine().bulkCreate(data, {
              transaction: t
            });
          });
        });
      }).then(function(result) {
        console.log('\nRESULT:\n' + result);
        /*
        executed++;
        if (nbOrders == (i + 1)) res.json({
          result: true,
          message: executed + ' order(s) generated !'
        });
        */
      }).catch(function(err) {
        console.log('\nERR:\n' + err.message);
        /*
        if (nbOrders == (i + 1)) {
          if (executed > 0) {
            res.json({result: true, message: executed + ' order(s) generated !'});
          }
          else {
            res.json({result: false, message: 'Any order can be generated'});
          }
        }
        */
      });
    }
  }
  catch (e) {
    console.log('\nE:\n' + e.message);
    /*
    res.json({result: false, message: e.message});
    */
  }
}

try {
  dbManager.authenticate();
  db.connect();
}
catch (e) {
  console.log(e.message);
}
finally {
  db.close();
}

/* ******************************************************************************************* *
    Server initialization
 * ******************************************************************************************* */

app.listen(4000);