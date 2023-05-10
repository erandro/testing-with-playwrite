const { expect } = require('@playwright/test');

class OrdersReviewPage {

    constructor(page) {
        this.page = page;
        this.shippingInfoInputs = page.locator('.details__user input');
        this.shippingEmailLabel = page.locator('.details__user label');
        this.locationResults = page.locator('.ta-results');
        this.placeOrderButton = page.locator('.action__submit');
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async checkEmail(email) {
        await expect(this.shippingEmailLabel).toHaveText(email);
    }

    async searchCountryAndSelect(countryCode, countryName) {
        countryName = ' ' + countryName;
        await this.shippingInfoInputs.nth(1).type(countryCode, { delay: 100 });
        await this.locationResults.waitFor();
        await this.locationResults.locator('span', { hasText: countryName }).click();
    }

    async SubmitAndGetOrderId() {
        await this.placeOrderButton.click();
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        return await this.orderId.textContent();
    }
}

module.exports = { OrdersReviewPage };