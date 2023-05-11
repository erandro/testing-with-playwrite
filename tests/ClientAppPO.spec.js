const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');
const dataSet = JSON.parse(JSON.stringify(require('../utils/PlaceOrderTestData.json')));

test('Client App login', async ({ page }) => {

    const poManager = new POManager(page);

    // Login:
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(dataSet.username, dataSet.password);

    // Add product to cart:
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(dataSet.productName);
    await dashboardPage.navigateToCart();

    // Verify product and checkout:
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(dataSet.productName);
    expect(cartPage.VerifyProductIsDisplayed(dataSet.productName)).toBeTruthy();
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