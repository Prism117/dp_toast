export interface MappingArray {
  type:
    | "Sales Category"
    | "Menu Group"
    | "Payment"
    | "Tax"
    | "Tips"
    | "Service Charge"
    | "Stats";
  key1: string;
  key2?: string;
  key3?: string;
  customDescription?: string;
  gl: string;
}

export interface Payments {
  type: string;
  total: number;
  tipAmount: number;
}

export type ItemProps = Map<
  string,
  { salesCategory?: string; menuGroup?: string; name: string }
>;

export type JournalItem = {
  gl: string;
  amount: number;
  reference?: string;
  description: string;
  date: string;
  month: number;
  year: number;
  journalCode: string;
  user?: string;
  units?: number | string;
  propID?: string;
  reverse?: string;
  comments?: string;
};

export type MappableItems = {
  type:
    | "Sales Category"
    | "Menu Group"
    | "Payment"
    | "Tax"
    | "Tips"
    | "Service Charge"
    | "Stats"
    | "Item";
  key: string;
  id?: string;
  amount: number;
};
