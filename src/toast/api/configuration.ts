import { AxiosResponse } from "axios";
import Toast from "./toast.js";
import { SalesCategories, TaxRates } from "../Types/type_configuration.js";

//Acceptable config items
const VALID_ITEMS = [
  "salesCategories",
  "menuGroups",
  "revenueCenters",
  "restaurantServices",
  "taxRates",
  "serviceCharges",
  "alternatePaymentTypes",
] as const;

//Types & Type Checking
export type ItemsEnum = (typeof VALID_ITEMS)[number];

export type HashOptions = Partial<Record<ItemsEnum, string>>;

function isAssertValid(param: any): asserts param is ItemsEnum {
  if (
    !param ||
    typeof param != "string" ||
    !VALID_ITEMS.includes(param as ItemsEnum)
  ) {
    throw new Error("Bad request");
  }
}

export default class Configuration {
  api: Toast;
  property: string;
  constructor(api: Toast, property: string) {
    this.api = api;
    this.property = property;
  }
  async #fetch_config<T>(endpoint: string): Promise<T[]> {
    const newEndpoint = `/config/v2/${endpoint}`;
    try {
      const initialData = await this.api.fetch<AxiosResponse>(
        this.property,
        newEndpoint,
        {
          returnRes: true,
        }
      );
      let data: T[] = initialData.data;
      const NEXT_PAGE_HEADER = "toast-next-page-token" as const;
      let hasNextPage = initialData.headers.hasOwnProperty(NEXT_PAGE_HEADER);
      if (!hasNextPage) {
        return data;
      }
      let headers = initialData.headers;
      while (hasNextPage) {
        const nextRes = await this.api.fetch<AxiosResponse>(
          this.property,
          newEndpoint,
          {
            returnRes: true,
            params: { pageToken: headers[NEXT_PAGE_HEADER] },
          }
        );
        if (!(nextRes instanceof Object)) {
          throw Error("");
        }
        data.push(...nextRes.data);
        hasNextPage = nextRes.headers.hasOwnProperty(NEXT_PAGE_HEADER);
        headers = hasNextPage ? nextRes.headers : {};
      }
      return data;
    } catch (error) {
      throw Error("Orders API Error", { cause: error });
    }
  }

  async createHash(items: any[], id: string = ""): Promise<Map<string, any>> {
    let hash: Map<string, any> = new Map<string, any>();
    for (const item of items) {
      hash.set(item["guid"], id ? item[id] : item);
    }
    return hash;
  }

  /*
    Items is Array of strings
  */
  async getConfig<Return>(
    configNames: Array<ItemsEnum>,
    customHash: HashOptions = {}
  ): Promise<Return> {
    let config: any = {};
    let name: ItemsEnum;
    for (name of configNames) {
      try {
        isAssertValid(name);
      } catch {
        continue;
      }
      const data = await this.#fetch_config<typeof name>(name);
      const hashItems = customHash.hasOwnProperty(name) ? customHash[name] : "";
      const hash = await this.createHash(data, hashItems);
      config[name] = hash;
    }
    return config;
  }
}
