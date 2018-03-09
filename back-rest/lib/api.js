"use strict";

module.exports = new class API {
  
  getAlert(conn) {
    let sql = `SELECT * FROM "alert"`;
    try {
      conn.get(sql, [], (err, row) => {
        if (err) throw err;
        if (row) return row;
      });
    }
    catch (e) {
      throw e;
    }
  }
  
  deleteAlert(conn, params) {
    let _this = this;
    let sql = `SELECT * FROM "alert" WHERE id = ?`;
    try {
      conn.get(sql, [params.id], (err, row) => {
        if (err) throw err;
        if (row) {
          _this.updateProductStock(db, {id: row.id_product, stock: params.stock});
          _this.updateAlertStatus(db, {id: row.id, id_status: 1});
        }
      });
    }
    catch (e) {
      throw e;
    }
  }
  
  updateProductStock(conn, params) {
    let sql = `UPDATE "product" SET stock = ? WHERE id = ?`;
    try {
      conn.run(sql, [params.stock, params.id], (err) => {
        if (err) throw err;
      });
    }
    catch (e) {
      throw e;
    }
  }
  
  updateAlertStatus(conn, params) {
    let sql = `UPDATE "alert" SET id_status = ? WHERE id = ?`;
    try {
      conn.run(sql, [params.id_status, params.id], (err) => {
        if (err) throw err;
      });
    }
    catch (e) {
      throw e;
    }
  }
  
  
  
}