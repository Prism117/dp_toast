//Acceptable config items
const VALID_ITEMS = [
    "salesCategories",
    "menuGroups",
    "revenueCenters",
    "restaurantServices",
    "taxRates",
    "serviceCharges",
    "alternatePaymentTypes",
];
function isAssertValid(param) {
    if (!param ||
        typeof param != "string" ||
        !VALID_ITEMS.includes(param)) {
        throw new Error("Bad request");
    }
}
export default class Configuration {
    api;
    property;
    constructor(api, property) {
        this.api = api;
        this.property = property;
    }
    async #fetch_config(endpoint) {
        const newEndpoint = `/config/v2/${endpoint}`;
        try {
            const initialData = await this.api.fetch(this.property, newEndpoint, {
                returnRes: true,
            });
            let data = initialData.data;
            const NEXT_PAGE_HEADER = "toast-next-page-token";
            let hasNextPage = initialData.headers.hasOwnProperty(NEXT_PAGE_HEADER);
            if (!hasNextPage) {
                return data;
            }
            let headers = initialData.headers;
            while (hasNextPage) {
                const nextRes = await this.api.fetch(this.property, newEndpoint, {
                    returnRes: true,
                    params: { pageToken: headers[NEXT_PAGE_HEADER] },
                });
                if (!(nextRes instanceof Object)) {
                    throw Error("");
                }
                data.push(...nextRes.data);
                hasNextPage = nextRes.headers.hasOwnProperty(NEXT_PAGE_HEADER);
                headers = hasNextPage ? nextRes.headers : {};
            }
            return data;
        }
        catch (error) {
            throw Error("Orders API Error", { cause: error });
        }
    }
    async createHash(items, id = "") {
        let hash = new Map();
        for (const item of items) {
            hash.set(item["guid"], id ? item[id] : item);
        }
        return hash;
    }
    /*
      Items is Array of strings
    */
    async getConfig(configNames, customHash = {}) {
        let config = {};
        let name;
        for (name of configNames) {
            try {
                isAssertValid(name);
            }
            catch {
                continue;
            }
            const data = await this.#fetch_config(name);
            const hashItems = customHash.hasOwnProperty(name) ? customHash[name] : "";
            const hash = await this.createHash(data, hashItems);
            config[name] = hash;
        }
        return config;
    }
}
