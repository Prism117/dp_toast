export default class Orders {
    api;
    property;
    constructor(api, property) {
        this.api = api;
        this.property = property;
    }
    async getMultiOrders(query = {}) {
        const endpoint = "/orders/v2/ordersBulk";
        const data = [];
        try {
            const firstResponse = await this.api.fetch(this.property, endpoint, { params: query });
            if (!Array.isArray(firstResponse)) {
                throw Error("Invalid Response.");
            }
            data.push(...firstResponse);
            //Max Page Length defaults to 100
            let hasNextPage = firstResponse.length === 100;
            let nextPage = 2;
            while (hasNextPage) {
                const subsResponse = await this.api.fetch(this.property, endpoint, { params: { ...query, page: nextPage } });
                if (!Array.isArray(subsResponse)) {
                    throw Error("Invalid Response.");
                }
                data.push(...subsResponse);
                hasNextPage = subsResponse.length === 100;
                nextPage++;
            }
            console.log("# Orders", data.length);
            return data;
        }
        catch (error) {
            throw Error("Orders API Error", { cause: error });
        }
    }
}
