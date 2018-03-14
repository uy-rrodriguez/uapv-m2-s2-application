"use_strict";

module.exports = new class OrderGenerator {
  constructor() {
    
  }
  
  generateOrders(dbManager) {
    for (var i = 1; i < 6; i++) {
      
    }
    dbManager.order().create().then();
    dbManager.orderLine().create().then();
  }
}