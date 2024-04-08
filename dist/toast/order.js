export default class Orders {
    api;
    property;
    constructor(api, property) {
        this.api = api;
        this.property = property;
    }
    async getMultiOrders(query = {}) {
        const endpoint = "/orders/v2/ordersBulk";
        try {
            const data = await this.api.fetch(this.property, endpoint, { params: query });
            console.log("# Orders", data.length);
            return data;
        }
        catch (error) {
            throw Error("Orders API Error", { cause: error });
        }
    }
}
