import axios, { AxiosResponse } from "axios";

export type Credentials = {
  hostname: string;
  clientID: string;
  clientSecret: string;
};

type R = {
  params?: {};
  returnRes?: boolean;
};

type ObjectType<T, R> = T extends { returnRes: true } ? AxiosResponse<R> : R;

export default class Toast {
  hostname: string;
  clientID: string;
  clientSecret: string;
  token: string = "";
  constructor(credentials: Credentials) {
    this.hostname = credentials.hostname;
    this.clientID = credentials.clientID;
    this.clientSecret = credentials.clientSecret;
  }

  async initialize(): Promise<void> {
    const url: string = `https://${this.hostname}/authentication/v1/authentication/login`;
    const body = {
      clientId: this.clientID,
      clientSecret: this.clientSecret,
      userAccessType: "TOAST_MACHINE_CLIENT",
    };
    try {
      const response = await axios.post(url, body);
      this.token = response.data.token.accessToken;
    } catch (error) {
      throw Error("Auth Error", { cause: error });
    }
  }
  async fetch<T>(
    restrauntId: string,
    endpoint: string,
    options: R
  ): Promise<AxiosResponse | T> {
    options = {
      params: {},
      returnRes: false,
      ...options,
    };
    console.log("options", options);
    const url = `https://${this.hostname}${endpoint}`;
    console.log("url", url);
    const headers = {
      "Toast-Restaurant-External-ID": restrauntId,
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
    console.log("headers", headers);
    try {
      const response = await axios.get(url, {
        headers,
        params: options.params,
      });
      if (options.returnRes) {
        return response;
      }
      return response.data;
    } catch (error) {
      throw Error("API Error", { cause: error });
    }
  }
}
