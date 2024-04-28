import axios from "axios";
export default class Toast {
    hostname;
    clientID;
    clientSecret;
    token = "";
    constructor(credentials) {
        this.hostname = credentials.hostname;
        this.clientID = credentials.clientID;
        this.clientSecret = credentials.clientSecret;
    }
    async initialize() {
        const url = `https://${this.hostname}/authentication/v1/authentication/login`;
        const body = {
            clientId: this.clientID,
            clientSecret: this.clientSecret,
            userAccessType: "TOAST_MACHINE_CLIENT",
        };
        try {
            const response = await axios.post(url, body);
            this.token = response.data.token.accessToken;
        }
        catch (error) {
            throw Error("Auth Error", { cause: error });
        }
    }
    async fetch(restrauntId, endpoint, options) {
        options = {
            params: {},
            returnRes: false,
            ...options,
        };
        const url = `https://${this.hostname}${endpoint}`;
        console.log("url", url);
        const headers = {
            "Toast-Restaurant-External-ID": restrauntId,
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
        };
        try {
            const response = await axios.get(url, {
                headers,
                params: options.params,
            });
            if (options.returnRes) {
                return response;
            }
            return response.data;
        }
        catch (error) {
            throw Error("API Error", { cause: error });
        }
    }
}
