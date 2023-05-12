const { test, expect } = require('@playwright/test');

let webContext;

test.beforeAll( async ({browser}) =>  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://www.rahulshettyacademy.com/client");
    await page.locator('#userEmail').type('anshika4@gmail.com');
    await page.locator('#userPassword').type('Iamking@000');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path: 'state.json'});

    webContext = await browser.newContext({storageState: 'state.json'});
});

test('@API Print titltes', async () => {

    const page = await webContext.newPage();
    await page.goto("http://www.rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');

    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles)
});

test('@API Print titles again', async () => {

    const page = await webContext.newPage();
    await page.goto("http://www.rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');

    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles)
});