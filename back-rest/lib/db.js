"use strict";

var sqlite3 = require("sqlite3");

// TABLE STRUCTURES ////////////////////////////////////////////////////////////

var roleTableDrop = `DROP TABLE IF EXISTS "role"`;
var roleTableCreate = `CREATE TABLE IF NOT EXISTS "role"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT)`;

var userTableDrop = `DROP TABLE IF EXISTS "user"`;
var userTableCreate = `CREATE TABLE IF NOT EXISTS "user"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_role INTEGER NOT NULL,
  name TEXT,
  password TEXT,
  max_weight REAL,
  FOREIGN KEY (id_role) REFERENCES "role"(id))`;

var orderGroupTableDrop = `DROP TABLE IF EXISTS "order_group"`;
var orderGroupTableCreate = `CREATE TABLE IF NOT EXISTS "order_group"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_user INTEGER NOT NULL,
  total_weight REAL,
  FOREIGN KEY (id_user) REFERENCES "user"(id))`;

var orderGroupLineTableDrop = `DROP TABLE IF EXISTS "order_group_line"`;
var orderGroupLineTableCreate = `CREATE TABLE IF NOT EXISTS "order_group_line"(
  id_order_group INTEGER NOT NULL,
  id_order INTEGER NOT NULL,
  FOREIGN KEY (id_order_group) REFERENCES "order_group"(id),
  FOREIGN KEY (id_order) REFERENCES "order"(id),
  PRIMARY KEY (id_order_group, id_order))`;

var orderStatusTableDrop = `DROP TABLE IF EXISTS "order_status"`;
var orderStatusTableCreate = `CREATE TABLE IF NOT EXISTS "order_status"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT)`;

var orderTableDrop = `DROP TABLE IF EXISTS "order"`;
var orderTableCreate = `CREATE TABLE IF NOT EXISTS "order"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_order_status INTEGER NOT NULL,
  client TEXT,
  date TEXT,
  FOREIGN KEY (id_order_status) REFERENCES "order_status"(id))`;

var orderLineTableDrop = `DROP TABLE IF EXISTS "order_line"`;
var orderLineTableCreate = `CREATE TABLE IF NOT EXISTS "order_line"(
  id_product INTEGER NOT NULL,
  id_order INTEGER NOT NULL,
  quantity INTEGER,
  FOREIGN KEY (id_product) REFERENCES "product"(id),
  FOREIGN KEY (id_order) REFERENCES "order"(id),
  PRIMARY KEY (id_product, id_order))`;

var sectionTableDrop = `DROP TABLE IF EXISTS "section"`;
var sectionTableCreate = `CREATE TABLE IF NOT EXISTS "section"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  row INTEGER,
  column INTEGER)`;

var rackTableDrop = `DROP TABLE IF EXISTS "rack"`;
var rackTableCreate = `CREATE TABLE IF NOT EXISTS "rack"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_section INTEGER NOT NULL,
  row INTEGER,
  column INTEGER,
  FOREIGN KEY (id_section) REFERENCES "section"(id))`;

var productTableDrop = `DROP TABLE IF EXISTS "product"`;
var productTableCreate = `CREATE TABLE IF NOT EXISTS "product"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_rack INTEGER NOT NULL,
  name TEXT,
  stock INTEGER,
  weight REAL,
  FOREIGN KEY (id_rack) REFERENCES "rack"(id))`;

var alertStatusTableDrop = `DROP TABLE IF EXISTS "alert_status"`;
var alertStatusTableCreate = `CREATE TABLE IF NOT EXISTS "alert_status"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT)`;

var alertTableDrop = `DROP TABLE IF EXISTS "alert"`;
var alertTableCreate = `CREATE TABLE IF NOT EXISTS "alert"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_product INTEGER NOT NULL,
  id_alert_status INTEGER NOT NULL,
  stock INTEGER,
  FOREIGN KEY (id_product) REFERENCES "product"(id),
  FOREIGN KEY (id_alert_status) REFERENCES "alert_status"(id))`;

// DATA ////////////////////////////////////////////////////////////////////////

var alertStatusData = `REPLACE INTO "alert_status"(id, name) VALUES (
  1, "Traitée"), (
  2, "Non traitée")`;

var orderStatusData = `REPLACE INTO "order_status"(id, name) VALUES (
  1, "Complet"), (
  2, "Incomplet")`;

var roleData = `REPLACE INTO "role"(id, name) VALUES (
  1, "Administrateur"), (
  2, "Manager"), (
  3, "Préparateur de commande")`;

var sectionData = `REPLACE INTO "section"(id, row, column) VALUES (
  1, 1, 1), (
  2, 1, 2), (
  3, 1, 3), (
  4, 1, 4), (
  5, 2, 1), (
  6, 2, 2), (
  7, 2, 3), (
  8, 2, 4), (
  9, 3, 1), (
  10, 3, 2), (
  11, 3, 3), (
  12, 3, 4), (
  13, 4, 1), (
  14, 4, 2), (
  15, 4, 3), (
  16, 4, 4)`;

var rackData = `REPLACE INTO "rack"(id, id_section, row, column) VALUES (
  1, 1, 1, 1), (
  2, 1, 1, 2), (
  3, 1, 1, 3), (
  4, 1, 2, 1), (
  5, 1, 2, 2), (
  6, 1, 2, 3), (
  7, 1, 3, 1), (
  8, 1, 3, 2), (
  9, 1, 3, 3), (
  10, 2, 1, 1), (
  11, 2, 1, 2), (
  12, 2, 1, 3), (
  13, 2, 2, 1), (
  14, 2, 2, 2), (
  15, 2, 2, 3), (
  16, 2, 3, 1), (
  17, 2, 3, 2), (
  18, 2, 3, 3), (
  19, 3, 1, 1), (
  20, 3, 1, 2), (
  21, 3, 1, 3), (
  22, 3, 2, 1), (
  23, 3, 2, 2), (
  24, 3, 2, 3), (
  25, 3, 3, 1), (
  26, 3, 3, 2), (
  27, 3, 3, 3), (
  28, 4, 1, 1), (
  29, 4, 1, 2), (
  30, 4, 1, 3), (
  31, 4, 2, 1), (
  32, 4, 2, 2), (
  33, 4, 2, 3), (
  34, 4, 3, 1), (
  35, 4, 3, 2), (
  36, 4, 3, 3), (
  37, 5, 1, 1), (
  38, 5, 1, 2), (
  39, 5, 1, 3), (
  40, 5, 2, 1), (
  41, 5, 2, 2), (
  42, 5, 2, 3), (
  43, 5, 3, 1), (
  44, 5, 3, 2), (
  45, 5, 3, 3), (
  46, 6, 1, 1), (
  47, 6, 1, 2), (
  48, 6, 1, 3), (
  49, 6, 2, 1), (
  50, 6, 2, 2), (
  51, 6, 2, 3), (
  52, 6, 3, 1), (
  53, 6, 3, 2), (
  54, 6, 3, 3), (
  55, 7, 1, 1), (
  56, 7, 1, 2), (
  57, 7, 1, 3), (
  58, 7, 2, 1), (
  59, 7, 2, 2), (
  60, 7, 2, 3), (
  61, 7, 3, 1), (
  62, 7, 3, 2), (
  63, 7, 3, 3), (
  64, 8, 1, 1), (
  65, 8, 1, 2), (
  66, 8, 1, 3), (
  67, 8, 2, 1), (
  68, 8, 2, 2), (
  69, 8, 2, 3), (
  70, 8, 3, 1), (
  71, 8, 3, 2), (
  72, 8, 3, 3), (
  73, 9, 1, 1), (
  74, 9, 1, 2), (
  75, 9, 1, 3), (
  76, 9, 2, 1), (
  77, 9, 2, 2), (
  78, 9, 2, 3), (
  79, 9, 3, 1), (
  80, 9, 3, 2), (
  81, 9, 3, 3), (
  82, 10, 1, 1), (
  83, 10, 1, 2), (
  84, 10, 1, 3), (
  85, 10, 2, 1), (
  86, 10, 2, 2), (
  87, 10, 2, 3), (
  88, 10, 3, 1), (
  89, 10, 3, 2), (
  90, 10, 3, 3), (
  91, 11, 1, 1), (
  92, 11, 1, 2), (
  93, 11, 1, 3), (
  94, 11, 2, 1), (
  95, 11, 2, 2), (
  96, 11, 2, 3), (
  97, 11, 3, 1), (
  98, 11, 3, 2), (
  99, 11, 3, 3), (
  100, 12, 1, 1), (
  101, 12, 1, 2), (
  102, 12, 1, 3), (
  103, 12, 2, 1), (
  104, 12, 2, 2), (
  105, 12, 2, 3), (
  106, 12, 3, 1), (
  107, 12, 3, 2), (
  108, 12, 3, 3), (
  109, 13, 1, 1), (
  110, 13, 1, 2), (
  111, 13, 1, 3), (
  112, 13, 2, 1), (
  113, 13, 2, 2), (
  114, 13, 2, 3), (
  115, 13, 3, 1), (
  116, 13, 3, 2), (
  117, 13, 3, 3), (
  118, 14, 1, 1), (
  119, 14, 1, 2), (
  120, 14, 1, 3), (
  121, 14, 2, 1), (
  122, 14, 2, 2), (
  123, 14, 2, 3), (
  124, 14, 3, 1), (
  125, 14, 3, 2), (
  126, 14, 3, 3), (
  127, 15, 1, 1), (
  128, 15, 1, 2), (
  129, 15, 1, 3), (
  130, 15, 2, 1), (
  131, 15, 2, 2), (
  132, 15, 2, 3), (
  133, 15, 3, 1), (
  134, 15, 3, 2), (
  135, 15, 3, 3), (
  136, 16, 1, 1), (
  137, 16, 1, 2), (
  138, 16, 1, 3), (
  139, 16, 2, 1), (
  140, 16, 2, 2), (
  141, 16, 2, 3), (
  142, 16, 3, 1), (
  143, 16, 3, 2), (
  144, 16, 3, 3)`;

module.exports = new class DB {
  constructor() {
    this.connection = null;
  }

  connect() {
    if (this.connection !== null) {
      return this.connection;
    }

    this.connection = new sqlite3.Database("./db/back-rest.db", (err) => {
      if (err) {
        throw err;
      }
      return this.connection;
    });
  }

  close() {
    if (this.connection === null) {
      this.connection.close();
      this.connection = null;
    }
  }
  
  dropTables() {
    this.connection.run(orderGroupLineTableDrop);
    this.connection.run(orderLineTableDrop);
    this.connection.run(orderTableDrop);
    this.connection.run(orderStatusTableDrop);
    this.connection.run(orderGroupTableDrop);
    this.connection.run(userTableDrop);
    this.connection.run(roleTableDrop);
    this.connection.run(alertTableDrop);
    this.connection.run(alertStatusTableDrop);
    this.connection.run(productTableDrop);
    this.connection.run(rackTableDrop);
    this.connection.run(sectionTableDrop);
  }

  createTables() {
    this.connection.run(sectionTableCreate);
    this.connection.run(rackTableCreate);
    this.connection.run(productTableCreate);
    this.connection.run(alertStatusTableCreate);
    this.connection.run(alertTableCreate);
    this.connection.run(roleTableCreate);
    this.connection.run(userTableCreate);
    this.connection.run(orderGroupTableCreate);
    this.connection.run(orderStatusTableCreate);
    this.connection.run(orderTableCreate);
    this.connection.run(orderLineTableCreate);
    this.connection.run(orderGroupLineTableCreate);
  }
  
  insertData() {
    this.connection.run(alertStatusData);
    this.connection.run(orderStatusData);
    this.connection.run(roleData);
    this.connection.run(sectionData);
    this.connection.run(rackData);
  }
};