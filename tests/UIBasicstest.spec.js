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

test('Child window handaling', async ({browser}) =>{

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