export interface MappingArray {
  type:
    | "Sales Category"
    | "Menu Group"
    | "Payment"
    | "Tax"
    | "Tips"
    | "Service Charge";
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
  date: Date;
  month: number;
  year: number;
  journalCode: string;
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
