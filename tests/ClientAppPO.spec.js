const { test, expect } = require('@playwright/test');
const { costomTest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager');
const dataSet = JSON.parse(JSON.stringify(require('../utils/PlaceOrderTestData.json')));

for (const data of dataSet) {
    test(`Client App login for ${data.productName}`, async ({ page }) => {

        const poManager = new POManager(page);

        // Login:
        const loginPage = poManager.getLoginPage();
        await loginPage.goTo();
        await loginPage.validLogin(data.username, data.password);

        // Add product to cart:
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddCart(data.productName);
        await dashboardPage.navigateToCart();

        // Verify product and checkout:
        const cartPage = poManager.getCartPage();
        await cartPage.VerifyProductIsDisplayed(data.productName);
        expect(cartPage.VerifyProductIsDisplayed(data.productName)).toBeTruthy();
        await cartPage.Checkout();

        // Review order, add country and place order:
        const ordersReviewPage = poManager.getOrdersReviewPage();
        await ordersReviewPage.searchCountryAndSelect("isr", "Israel");
        const orderNumber = await ordersReviewPage.SubmitAndGetOrderId();
        console.log(orderNumber);
        await dashboardPage.navigateToOrders();
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        await ordersHistoryPage.findOrderAndClickOnIt(orderNumber);
        expect(orderNumber.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
    });
}

costomTest.only(`Client App login`, async ({ page, testDataFroOrder }) => {

    const poManager = new POManager(page);

    // Login:
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(testDataFroOrder.username, testDataFroOrder.password);

    // Add product to cart:
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(testDataFroOrder.productName);
    await dashboardPage.navigateToCart();

    // Verify product and checkout:
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataFroOrder.productName);
    expect(cartPage.VerifyProductIsDisplayed(testDataFroOrder.productName)).toBeTruthy();
    await cartPage.Checkout();

    // Review order, add country and place order:
    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("isr", "Israel");
    const orderNumber = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderNumber);
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    await ordersHistoryPage.findOrderAndClickOnIt(orderNumber);
    expect(orderNumber.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});