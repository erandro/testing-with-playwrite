const {test, expect} = require('@playwright/test');

test.skip('Page playwright test', async ({page}) => {

    await page.goto("http://www.google.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});

test.skip('Browser context playwright test (no server service)', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    console.log(await page.title());

    // enter wrong username

    // locate element with id
    const userName = page.locator('#username');
    await userName.type('rahulshetty');
    // locate element with attribute
    const password = page.locator("[type='password']");
    password.type('learning');
    // locate element with class
    const signInButton = page.locator('.btn-md');
    await signInButton.click();
    // wait until this locator is on the page
    const alert = page.locator("[style*='block']");
    await expect(alert).toContainText('Incorrect username/password')
    console.log(await alert.textContent());

    // enter correct username
    await userName.fill("");
    await userName.fill("rahulshettyacademy");

    // 1.1 since in this case there is no data coming from the server we can't do a 'waitForLoadState()' after the click. Instead, we should do a 'waitForNavigation()' before clicking on signInButton. We can also do some hacks like mentioned in 1.3.
    // Note that although 'waitForNavigation()' is marked for deprecation it is in-fact not (see conversation over https://github.com/microsoft/playwright/issues/20853 playwright issue page)
    await Promise.all(
        [
            page.waitForNavigation(),
            signInButton.click(),
        ]
    );
    // 1.2 You can also write this like this:
    // const navigationPromise = page.waitForNavigation();
    // signInButton.click()
    // await navigationPromise;
    const cardsTitles = page.locator(".card-body a");

    // 1.3 the next line is only making the code wait (not doing anything else). Whithout it allCardsTitles will fire imidiatly, since allTextContents() isn't an "auto-waiting" function, and will return [].
    //await cardsTitles.nth(0).textContent();
    const allCardsTitles = await cardsTitles.allTextContents();
    console.log(allCardsTitles);

});

test.skip('Browser context playwright test (with server service)', async ({page}) => {

    await page.goto("http://www.rahulshettyacademy.com/client");

    const userEmail = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    const loginButton = page.locator('#login');

    await userEmail.type('anshika@gmail.com');
    await userPassword.type('Iamking@000');
    await loginButton.click();

    // since data is coming from the server and evantually goes into idle state we can do 'waitForLoadState()':
    await page.waitForLoadState('networkidle');
    const titles = await page.locator('.card-body b').allTextContents();

    console.log(titles);

});

test.skip('UI controls', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");

    const userName = page.locator('#username');
    const password = page.locator('#password');
    await userName.fill('rahulshetty');
    await password.fill('learning');
    
    // selcting from select (dropdown) menu:
    const dropDownSelection = page.locator('select.form-control');
    await dropDownSelection.selectOption('teach');

    // selecting from a radio button:
    const radioButtonUser = page.locator('.radiotextsty').last();
    radioButtonUser.click();
    await page.locator('#okayBtn').click();
    expect(radioButtonUser).toBeChecked();
    // We can also do 'radioButtonUser.isChecked()' which will return a 'true' in this case

    const checkBoxTerms = page.locator('input#terms');
    await checkBoxTerms.check();
    expect(checkBoxTerms).toBeChecked();
    await checkBoxTerms.uncheck();
    expect(checkBoxTerms).not.toBeChecked();
    // We can also do 'expect( await checkBoxTerms.isChecked() ).toBeFalsy();'
    // Note that the 'await' above is inside the 'expect()' and not before it. This is because the action of the '.isChecked()' is done inside the expect and not outside.

    const blinkLink = page.locator("[href*='documents-request']");
    await expect(blinkLink).toHaveAttribute('class', 'blinkingText');
});

test.skip('Child window handaling', async ({browser}) =>{

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    const blinkLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        blinkLink.click(),
    ]);
    const redParagraph = await newPage.locator('.red').textContent();
    const domain = redParagraph.split('@')[1].split(' ')[0];

    const userName = page.locator('#username');
    await userName.fill(domain);
    await page.pause();
})

test('Happy path', async ({page}) => {

    await page.goto("http://www.rahulshettyacademy.com/client");

    const productName = "iphone 13 pro";
    const email = "anshika4@gmail.com";

    const userEmail = page.locator('#userEmail');
    const userPassword = page.locator('#userPassword');
    const loginButton = page.locator('#login');

    await userEmail.type(email);
    await userPassword.type('Iamking@000');
    await loginButton.click();

    // since data is coming from the server and evantually goes into idle state we can do 'waitForLoadState()':
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
    // waitFor() is for one element. If there are multiple elements we should use .first().waitFor()
    await page.locator('div.cart h3').waitFor();

    const cartItems = page.locator('.infoWrap');
    count = await cartItems.count();

    expect(count).toBe(1);
    expect( await page.locator('h3:has-text("iphone 13 pro")').isVisible() ).toBeTruthy();

    const checkoutButton = page.locator('.subtotal button');
    checkoutButton.click();
    // await page.locator('.form__cc').waitFor();
    // const personalInfoInputs = page.locator('.form__cc input');

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

    // await page.pause();
});