class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.tableRows = page.locator('table.table tbody tr');
        this.pieceOfTable = page.locator('table.table tbody tr th').first();
        this.orderdIdDetails = page.locator(".col-text");
    }

    async findOrderAndClickOnIt(orderNumber) {

        await this.pieceOfTable.waitFor();

        const count = await this.tableRows.count();
        for (let i = 0; i < count; i++) {
            const rowOrderNumber = await this.tableRows.nth(i).locator('th').textContent();
            if (orderNumber.includes(rowOrderNumber)) {
                await this.tableRows.nth(i).locator('td button:has-text("View")').click();
                break;
            }
        }
    }

    async getOrderId() {
        return await this.orderdIdDetails.textContent();
    }
}

module.exports = { OrdersHistoryPage };