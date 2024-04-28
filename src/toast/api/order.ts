import Toast from "./toast.js";
import { MultiOrderParams, MultiOrderReturn } from "../Types/type_orders.js";

export default class Orders {
  api: Toast;
  property: string;
  constructor(api: Toast, property: string) {
    this.api = api;
    this.property = property;
  }
  async getMultiOrders(
    query: MultiOrderParams = {}
  ): Promise<MultiOrderReturn[]> {
    const endpoint = "/orders/v2/ordersBulk";
    const data: MultiOrderReturn[] = [];
    try {
      const firstResponse = await this.api.fetch<MultiOrderReturn[]>(
        this.property,
        endpoint,
        { params: query }
      );
      if (!Array.isArray(firstResponse)) {
        throw Error("Invalid Response.");
      }
      data.push(...firstResponse);
      //Max Page Length defaults to 100
      let hasNextPage = firstResponse.length === 100;
      let nextPage = 2;
      while (hasNextPage) {
        const subsResponse = await this.api.fetch<MultiOrderReturn[]>(
          this.property,
          endpoint,
          { params: { ...query, page: nextPage } }
        );
        if (!Array.isArray(subsResponse)) {
          throw Error("Invalid Response.");
        }
        data.push(...subsResponse);
        hasNextPage = subsResponse.length === 100;
        nextPage++;
      }

      console.log("# Orders", data.length);
      return data;
    } catch (error) {
      throw Error("Orders API Error", { cause: error });
    }
  }
}
