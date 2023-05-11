const { test, expect, request } = require('@playwright/test');
const {ApiUtils} = require('../utils/ApiUtils');

const testEmail = 'anshika4@gmail.com';
const testPassword = 'Iamking@000';
const testCountry = 'Israel';
const testProductId = '6262e95ae26b7e1a10e89bf0';
const loginPayload = {userEmail: testEmail, userPassword: testPassword}
const orderPayload = {orders: [{country: testCountry, productOrderedId: testProductId}]}
let response;

test.beforeAll( async () =>  {
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils( apiContext, loginPayload );
    response = await apiUtils.createOrder(orderPayload);
});

test('Place an order', async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, response.token );
    
    await page.goto("https://www.rahulshettyacademy.com/client/");
    await page.locator("[routerlink='/dashboard/myorders']").click();
    await page.locator('table.table tbody tr th').first().waitFor();
    const tableRows = page.locator('table.table tbody tr');

    const count = await tableRows.count();
    for(let i=0; i<count; i++){
        const rowOrderNumber = await tableRows.nth(i).locator('th').textContent();
        if(response.orderNumber.includes(rowOrderNumber)){
            await tableRows.nth(i).locator('td button:has-text("View")').click();
            break;
        }
    }

    await page.locator('p:has-text("Thank you for Shopping With Us")').waitFor();
    const billingAndDeliveryAddress = page.locator('div.address');
    expect(await billingAndDeliveryAddress.nth(0).locator('p').nth(0).textContent() === " " + testEmail + " ").toBeTruthy();
    const orderSummaryNumber = await page.locator('.col-text').textContent();
    expect(orderSummaryNumber === response.orderNumber).toBeTruthy();
});