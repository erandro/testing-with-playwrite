class ApiUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    };

    async getToken() {
        const loginResponse = await this.apiContext.post('https://www.rahulshettyacademy.com/api/ecom/auth/login', {
            data: this.loginPayload,
        });
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }

    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken();

        const orderResponse = await this.apiContext.post('https://www.rahulshettyacademy.com/api/ecom/order/create-order', {
            data: orderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json',
            },
        });
        const orderrResponseJson = await orderResponse.json();
        response.orderNumber = orderrResponseJson.orders[0]

        return response;
    }
}

module.exports = { ApiUtils }