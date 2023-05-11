const base = require('@playwright/test');

exports.costomTest = base.test.extend({
    testDataFroOrder: {
        username: "anshika@gmail.com",
        password: "Iamking@000",
        productName: "zara coat 3"
    }
})