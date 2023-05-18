const { test, expect } = require('@playwright/test');

// test.describe.configure({ mode: 'serial' });

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
    // page.on("dialog", async (alert) => {
    //     await alert.dismiss();
    // })
    // page.on('dialog', dialog => dialog.dismiss())
    await confirmButton.click();
});

test('Hover', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

    await page.locator('#mousehover').hover();
});

test('Dealing with iFrames', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');

    const framePage = page.frameLocator('#courses-iframe');
    await page.locator('#courses-iframe').scrollIntoViewIfNeeded();
    await framePage.locator('li a[href*="lifetime-access"]:visible').click({
        delay: 100,
    });
    const textCheck = await framePage.locator('.text h2').textContent()
    console.log(textCheck.split(' ')[1])
});

test('Screenshots & visual comparision', async ({ page }) => {
    await page.goto('http://www.rahulshettyacademy.com/AutomationPractice/');
    const displayText = page.locator('#displayed-text');
    await expect(displayText).toBeVisible();
    // await displayText.screenshot({path: 'screenshot1.png'});
    await page.locator('#hide-textbox').click();
    // await page.screenshot({path: 'screenshot.png'});
    await expect(displayText).toBeHidden();

    // this is going to fail for the first time with "Error: A snapshot doesn't exist at [path]" but it will work on second time 
    expect(await page.screenshot()).toMatchSnapshot('hiddenButton.png');
});