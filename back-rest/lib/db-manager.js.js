"use strict";

var Sequelize = require('sequelize');

module.exports = new class DBManager {
  constructor() {
    this.sequelize = new Sequelize('back-rest.db', '', '', {
      host: 'localhost',
      dialect: 'sqlite',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      storage: './db/back-rest.db',
      operatorsAliases: false
    });
    
    
    
    this.Op = Sequelize.Op;
    
    
    
    this.Role = this.sequelize.define('role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.TEXT
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'role'
    });
    
    
    
    this.User = this.sequelize.define('user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.TEXT,
      password: Sequelize.TEXT,
      max_weight: Sequelize.REAL
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'user'
    });
    this.User.belongsTo(this.Role, {
      foreignKey: 'id_role',
      foreignKeyConstraint: true
    });
    
    
    
    this.OrderGroup = this.sequelize.define('order_group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      total_weight: Sequelize.REAL
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order_group'
    });
    this.OrderGroup.belongsTo(this.User, {
      foreignKey: 'id_user',
      foreignKeyConstraint: true
    });
    
    
    
    this.OrderStatus = this.sequelize.define('order_status', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.TEXT
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order_status'
    });
    
    
    
    this.Order = this.sequelize.define('order', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      client: Sequelize.TEXT,
      date: Sequelize.TEXT
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order'
    });
    this.Order.belongsTo(this.OrderStatus, {
      foreignKey: 'id_order_status',
      foreignKeyConstraint: true
    });
    
    
    
    this.Section = this.sequelize.define('section', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      row: Sequelize.INTEGER,
      column: Sequelize.INTEGER
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'section'
    });
    
    
    
    this.Rack = this.sequelize.define('rack', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      row: Sequelize.INTEGER,
      column: Sequelize.INTEGER
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'rack'
    });
    this.Rack.belongsTo(this.Section, {
      foreignKey: 'id_section',
      foreignKeyConstraint: true
    });
    
    
    
    this.Product = this.sequelize.define('product', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.TEXT,
      stock: Sequelize.INTEGER,
      weight: Sequelize.REAL
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'product'
    });
    this.Product.belongsTo(this.Rack, {
      foreignKey: 'id_rack',
      foreignKeyConstraint: true
    });
    
    
    
    this.AlertStatus = this.sequelize.define('alert_status', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.TEXT
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'alert_status'
    });
    
    
    
    this.Alert = this.sequelize.define('alert', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      stock: Sequelize.INTEGER
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'alert'
    });
    this.Alert.belongsTo(this.Product, {
      foreignKey: 'id_product',
      foreignKeyConstraint: true
    });
    this.Alert.belongsTo(this.AlertStatus, {
      foreignKey: 'id_alert_status',
      foreignKeyConstraint: true
    });
    
    
    
    this.OrderGroupLine = this.sequelize.define('order_group_line', {}, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order_group_line'
    });
    /*this.OrderGroup.belongsToMany(this.Order, {
      through: this.OrderGroupLine,
      foreignKey: 'id_order',
      foreignKeyConstraint: true
    });*/
    this.OrderGroupLine.belongsTo(this.OrderGroup, {
      foreignKey: 'id_order_group',
      foreignKeyConstraint: true
    });
    this.OrderGroup.hasMany(this.OrderGroupLine, {
      as: 'order_group_line',
      foreignKey: 'id_order_group'
    });
    /*this.Order.belongsToMany(this.OrderGroup, {
      through: this.OrderGroupLine,
      foreignKey: 'id_order_group',
      foreignKeyConstraint: true
    });*/
    this.OrderGroupLine.belongsTo(this.Order, {
      foreignKey: 'id_order',
      foreignKeyConstraint: true
    });
    this.Order.hasMany(this.OrderGroupLine, {
      as: 'order_group_line',
      foreignKey: 'id_order'
    });
    
    
    
    this.OrderLine = this.sequelize.define('order_line', {
      quantity: Sequelize.INTEGER
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'order_line'
    });
    /*this.Product.belongsToMany(this.Order, {
      through: this.OrderLine,
      foreignKey: 'id_order',
      foreignKeyConstraint: true
    });*/
    this.OrderLine.belongsTo(this.Order, {
      foreignKey: 'id_order',
      foreignKeyConstraint: true
    });
    this.Order.hasMany(this.OrderLine, {
      as: 'order_line',
      foreignKey: 'id_order'
    });
    /*this.Order.belongsToMany(this.Product, {
      through: this.OrderLine,
      foreignKey: 'id_product',
      foreignKeyConstraint: true
    });*/
    this.OrderLine.belongsTo(this.Product, {
      foreignKey: 'id_product',
      foreignKeyConstraint: true
    });
    this.Product.hasMany(this.OrderLine, {
      as: 'order_line',
      foreignKey: 'id_product'
    });
    
    
    
    this.sequelize.sync().then(() => {
      console.log("Database created successfully !");
    });
  }
  
  test() {
    try {
      this.user().findOne().then(user => {
        console.log('User table:');
        if (!user) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.role().findOne().then(role => {
        console.log('Role table:');
        if (!role) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.orderGroup().findOne().then(orderGroup => {
        console.log('OrderGroup table:');
        if (!orderGroup) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.orderGroupLine().findOne().then(orderGroupLine => {
        console.log('OrderGroupLine table:');
        if (!orderGroupLine) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.orderStatus().findOne().then(orderStatus => {
        console.log('OrderStatus table:');
        if (!orderStatus) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.order().findOne().then(order => {
        console.log('Order table:');
        if (!order) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.orderLine().findOne().then(orderLine => {
        console.log('OrderLine table:');
        if (!orderLine) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.section().findOne().then(section => {
        console.log('Section table:');
        if (!section) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.rack().findOne().then(rack => {
        console.log('Rack table:');
        if (!rack) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.product().findOne().then(product => {
        console.log('Product table:');
        if (!product) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.alertStatus().findOne().then(alertStatus => {
        console.log('AlertStatus table:');
        if (!alertStatus) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
    
    try {
      this.alert().findOne().then(alert => {
        console.log('Alert table:');
        if (!alert) console.log('NOT OK');
        else console.log('OK');
      });
    }
    catch (e) {
      console.log(e.message);
    }
  }
  
  authenticate() {
    
    this.sequelize.authenticate()
            .then(() => {
              console.log('Connection has been established successfully.');
            })
            .catch(err => {
              console.log('Unable to connect to the database:', err);
            });
  }
  
  user() {
    //this.User.sync();
    
    return this.User;
  }
  
  role() {
    //this.Role.sync();
    
    return this.Role;
  }
  
  orderGroup() {
    //this.OrderGroup.sync();
    
    return this.OrderGroup;
  }
  
  orderGroupLine() {
    //this.OrderGroupLine.sync();
    
    return this.OrderGroupLine;
  }
  
  orderStatus() {
    //this.OrderStatus.sync();
    
    return this.OrderStatus;
  }
  
  order() {
    //this.Order.sync();
    
    return this.Order;
  }
  
  orderLine() {
    //this.OrderLine.sync();
    
    return this.OrderLine;
  }
  
  section() {
    //this.Section.sync();
    
    return this.Section;
  }
  
  rack() {
    //this.Rack.sync();
    
    return this.Rack;
  }
  
  product() {
    //this.Product.sync();
    
    return this.Product;
  }
  
  alertStatus() {
    //this.AlertStatus.sync();
    
    return this.AlertStatus;
  }
  
  alert() {
    //this.Alert.sync();
    
    return this.Alert;
  }
}