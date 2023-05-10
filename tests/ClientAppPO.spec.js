const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test('Client App login', async ({ page }) => {

    const poManager = new POManager(page);
   
    // Information:
    const username = "anshika@gmail.com";
    const password = "Iamking@000"
    const productName = 'zara coat 3';

    // Login:
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);

    // Add product to cart:
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(productName);
    await dashboardPage.navigateToCart();

    // Verify product and checkout:
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    expect(cartPage.VerifyProductIsDisplayed(productName)).toBeTruthy();
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