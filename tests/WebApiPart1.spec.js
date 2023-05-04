const { test, expect, request } = require('@playwright/test');

const loginPayload = {userEmail: "anshika4@gmail.com", userPassword: "Iamking@000"}
let token = '';

test.beforeAll( async () =>  {

    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post('https://www.rahulshettyacademy.com/api/ecom/auth/login', {data:loginPayload} ); // 200,201
    expect( loginResponse.ok() ).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    console.log(token)
});

test('Place an order', async ({ page }) => {

    page.addInitScript(value => { window.localStorage.setItem('token', value) }, token );
    
    await page.goto("http://www.rahulshettyacademy.com/client");

    const email = "anshika4@gmail.com";
    const productName = "iphone 13 pro";

    await page.waitForLoadState('networkidle');
    const productsCards = page.locator('.card-body');
    let count = await productsCards.count();
    for(let i=0; i<count; i++){
        if( await productsCards.nth(i).locator("b").textContent() === productName ){
            await productsCards.nth(i).locator('text= Add To Cart').click();
            break;
        }
    }

    const cartButton = page.locator("[routerlink='/dashboard/cart']");
    await cartButton.click();
    await page.locator('div.cart h3').waitFor();

    const cartItems = page.locator('.infoWrap');
    count = await cartItems.count();

    expect(count).toBe(1);
    expect( await page.locator('h3:has-text("iphone 13 pro")').isVisible() ).toBeTruthy();

    const checkoutButton = page.locator('.subtotal button');
    checkoutButton.click();

    await page.locator('.details__user').waitFor();
    const shippingInfoInputs = page.locator('.details__user input');

    await expect( page.locator('.details__user label') ).toHaveText(email);

    await shippingInfoInputs.nth(1).type('isr', {delay: 100});
    const locationResults = page.locator('.ta-results');
    await locationResults.waitFor();
    await locationResults.locator('span', {hasText: ' Israel'}).click();

    const placeOrderButton = page.locator('.action__submit');
    await placeOrderButton.click();

    await page.locator('.hero-primary').waitFor();
    const thankYouHeadline = page.locator('.hero-primary');
    await expect(thankYouHeadline).toHaveText(' Thankyou for the order. ');
    let orderNumber = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    orderNumber = orderNumber.slice(3).slice(0, -3);

    const ordersButton = page.locator("td [routerlink='/dashboard/myorders']");
    await ordersButton.click();
    await page.locator('table.table tbody tr th').first().waitFor();

    const tableRows = page.locator('table.table tbody tr');
    count = await tableRows.count();
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