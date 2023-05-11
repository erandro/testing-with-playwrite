const { test, expect, request } = require('@playwright/test');
const { ApiUtils } = require('../utils/ApiUtils');

const testEmail = 'anshika4@gmail.com';
const testPassword = 'Iamking@000';
const testCountry = 'Israel';
const testProductId = '6262e95ae26b7e1a10e89bf0';
const loginPayload = { userEmail: testEmail, userPassword: testPassword }
const orderPayload = { orders: [{ country: testCountry, productOrderedId: testProductId }] }
const fakePayloadOrders = { data: [], message: 'No Orders' };
let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Check that no orders is showing when there are no orders', async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto('https://www.rahulshettyacademy.com/client/');
    page.route('https://www.rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6452766e568c3e9fb1630a6c',
        async route => {
            const orderResponse = await page.request.fetch(route.request());
            route.fulfill({
                response: orderResponse,
                body: fakePayloadOrders,
            });
        })
    await page.locator('button[routerlink*="myorders"]').click();
    console.log(await page.locator('.mt-4').textContent());
});