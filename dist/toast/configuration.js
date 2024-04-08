//Acceptable config items
const VALID_ITEMS = [
    "salesCategories",
    "menuGroups",
    "revenueCenters",
    "restaurantServices",
    "taxRates",
    "serviceCharges",
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
            console.log("init", initialData);
            let data = initialData.data;
            const headers = initialData.headers;
            let hasNextPage = headers.hasOwnProperty("Toast-Next-Page-Token");
            while (hasNextPage) {
                const nextRes = await this.api.fetch(this.property, newEndpoint, {
                    returnRes: true,
                });
                data.push(nextRes.data);
                hasNextPage = nextRes.headers.hasOwnProperty("Toast-Next-Page-Token");
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
            const hash = this.createHash(data, hashItems);
            config[name] = hash;
        }
        return config;
    }
}
