const { test, expect } = require('@playwright/test');

test('Navigating back and forward on the browser', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');
    await page.goto('https://google.com');
    await page.goBack();
    await page.goForward();
});

test('Dealing with hidden/visable elements', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

    const displayText = page.locator('#displayed-text');
    await expect(displayText).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(displayText).toBeHidden();
});

test('Dealing with alerts/confirms popups', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

    const alertButton = page.locator('#alertbtn');
    const confirmButton = page.locator('#confirmbtn');
    page.on('dialog', dialog => dialog.accept())
    await alertButton.click();
    // page.on('dialog', dialog => dialog.dismiss())
    await confirmButton.click();
});

test('Hover', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

    await page.locator('#mousehover').hover();
});

// test.only('Dealing with iFrames', async ({ page }) => {
//     await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

//     const framePage = page.frameLocator('#courses-iframe');
//     await framePage.locator('li a[href*="lifetime-access"]:visible').click()
//     const textCheck = await framePage.locator('.text h2').textContent()
//     console.log(textCheck.split(' ')[1])
// });