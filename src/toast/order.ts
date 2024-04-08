import Toast from "./toast.js";
import { MultiOrderParams, MultiOrderReturn } from "./type_orders.js";

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
    try {
      const data = await this.api.fetch<MultiOrderReturn[]>(
        this.property,
        endpoint,
        { params: query }
      );
      if (!Array.isArray(data)) {
        throw Error("Invalid Response.");
      }
      console.log("# Orders", data.length);
      return data;
    } catch (error) {
      throw Error("Orders API Error", { cause: error });
    }
  }
}
