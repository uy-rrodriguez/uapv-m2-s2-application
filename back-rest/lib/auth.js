"use strict";

var Sequelize = require('sequelize');

module.exports = new class Auth {
  
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
    
    this.Role = this.sequelize.define('Role', {
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
    
    this.User = this.sequelize.define('User', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Role,
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      name: Sequelize.TEXT,
      password: Sequelize.TEXT,
      max_weight: Sequelize.REAL
    }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'user'
    });
  }
  
  test() {
    this.User.sync();
    
    var user = this.User.create({ id_role: 1, name: 'name', password: 'password', max_weight: 50});
    
    console.log(user);
    
    return user;
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
  
}




