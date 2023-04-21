const {test, expect} = require('@playwright/test');

test('Browser context playwright test', async ({browser}) => {

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
    await signInButton.click();
    const cardsTitles = page.locator(".card-body a");
    // the next line is only making the code wait (not doing anything else). Whithout it allCardsTitles will fire imidiatly, since allTextContents() isn't an "auto-waiting" function, and will return [].
    await cardsTitles.nth(0).textContent();
    const allCardsTitles = await cardsTitles.allTextContents();
    console.log(allCardsTitles);

});

test('Page playwright test', async ({page}) => {

    await page.goto("http://www.google.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});