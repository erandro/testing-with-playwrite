const { test, expect, request } = require('@playwright/test');

const loginPayload = {userEmail: "anshika4@gmail.com", userPassword: "Iamking@000"}
const orderPayload = {orders: [{country: "Israel", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]}

let token = '';
let orderNumber = '';

test.beforeAll( async () =>  {

    const apiContext = await request.newContext();

    // login
    const loginResponse = await apiContext.post('https://www.rahulshettyacademy.com/api/ecom/auth/login', {
        data: loginPayload,
    } );
    expect( loginResponse.ok() ).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    // 
    
    const orderResponse = await apiContext.post('https://www.rahulshettyacademy.com/api/ecom/order/create-order', {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    } );
    const orderrResponseJson = await orderResponse.json();
    orderNumber = orderrResponseJson.orders[0];
});

test('Place an order', async ({ page }) => {

    page.addInitScript(value => { window.localStorage.setItem('token', value) }, token );
    
    await page.goto("http://www.rahulshettyacademy.com/client");

    const email = "anshika4@gmail.com";

    await page.locator("[routerlink='/dashboard/myorders']").click();
    await page.locator('table.table tbody tr th').first().waitFor();

    const tableRows = page.locator('table.table tbody tr');
    const count = await tableRows.count();
    for(let i=0; i<count; i++){
        const rowOrderNumber = await tableRows.nth(i).locator('th').textContent();
        if(orderNumber.includes(rowOrderNumber)){
            await tableRows.nth(i).locator('td button:has-text("View")').click();
            break;
        }
    }

    await page.locator('p:has-text("Thank you for Shopping With Us")').waitFor();
    const billingAndDeliveryAddress = page.locator('div.address');
    expect(await billingAndDeliveryAddress.nth(0).locator('p').nth(0).textContent() === " " + email + " ").toBeTruthy();
    const orderSummaryNumber = await page.locator('.col-text').textContent();
    expect(orderSummaryNumber === orderNumber).toBeTruthy();
});