"use strict";

var sqlite3 = require("sqlite3");

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

  createTables() {
    //db.run(`DROP TABLE IF EXISTS user`);
    this.connection.run(`CREATE TABLE IF NOT EXISTS user(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          password TEXT)`);
  }
};