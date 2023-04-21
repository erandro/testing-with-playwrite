const {test, expect} = require('@playwright/test');

test('Browser context playwright test', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    console.log(await page.title());

    // locate element with id
    await page.locator('#username').type('rahulshetty');
    // locate element with attribute
    await page.locator("[type='password']").type('learning');
    // locate element with class
    await page.locator('.btn-md').click();

    // wait until this locator is on the page
    const alert = page.locator("[style*='block']");
    await expect(alert).toContainText('Incorrect username/password')
    console.log(await alert.textContent());
});

test('Page playwright test', async ({page}) => {

    await page.goto("http://www.google.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});