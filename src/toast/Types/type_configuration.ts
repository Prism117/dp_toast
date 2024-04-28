export type ConfigParams = {
  lastModified?: string;
  page?: number;
  pageSize?: number;
  pageToken?: string;
};

type DefaultItem = {
  guid: string;
  entityType: string;
  externalId: string;
};

type Images = {
  url: string;
};

export type MenuGroup = {
  guid: string;
  entityType: string;
  externalId: string;
  name: string;
  menu: DefaultItem;
  orderableOnline: "YES" | "NO";
  visibility: "ALL" | "POS_ONLY" | "NONE";
  parent: DefaultItem;
  items: DefaultItem[];
  subgroups: DefaultItem[];
  optionGroups: DefaultItem[];
  inheritOptionGroups: boolean;
  images: Images[];
  unitOfMeasure: "NONE" | "LB" | "OZ" | "KG" | "G";
  inheritUnitOfMeasure: boolean;
};

export type RevenueCenter = {
  guid: string;
  entityType: string;
  name: string;
  description: string;
};

export type SalesCategories = {
  guid: string;
  entityType: string;
  name: string;
};

export type RestaurantServices = {
  guid: string;
  entityType: string;
  name: string;
};

export type TaxRates = {
  guid: string;
  entityType: string;
  name: string;
  isDefault: boolean;
  rate: number;
  type: "PERCENT" | "FIXED" | "TABLE" | "NONE" | "EXTERNAL";
  roundingType: "HALF_UP" | "HALF_EVEN" | "ALWAYS_UP" | "ALWAYS_DOWN";
  taxTable: {
    start: number;
    end: number;
    tax: number;
    pattern: boolean;
  }[];
  conditionalTaxRates: {
    condition: string;
    rate: number;
  }[];
};

export type ServiceCharge = {
  guid: string;
  entityType: string;
  externalId: string;
  name: string;
  amountType: "FIXED" | "PERCENT" | "OPEN";
  amount: number;
  percent: number;
  criteria: {
    minCheckAmount: number;
    delivery: boolean;
    maxCheckAmount: number;
    minDeliveryDistance: number;
    takeout: boolean;
    dineIn: boolean;
  };
  gratuity: boolean;
  taxable: boolean;
  applicableTaxes: TaxRates[];
  serviceChargeCalculation: "PRE_DISCOUNT" | "POST_DISCOUNT";
  destination: "RESTAURANT" | "TOAST" | "SERVER" | "THIRD_PARTY";
};

export type Discount = {
  guid: string;
  entityType: string;
  name: string;
  active: boolean;
  type:
    | "PERCENT"
    | "FIXED"
    | "OPEN_PERCENT"
    | "OPEN_FIXED"
    | "BOGO"
    | "FIXED_TOTAL";
  percentage: number;
  amount: number;
  selectionType: "CHECK" | "ITEM" | "BOGO";
  nonExclusive: boolean;
  itemPickingPriority: "FIRST" | "LEAST_EXPENSIVE" | "MOST_EXPENSIVE";
  fixedTotal: number;
};
