import Toast from "../../api/toast.js";
import Configuration from "../../api/configuration.js";
//typing
import { TaxRates, ServiceCharge } from "../../Types/type_configuration.js";
import { ItemsEnum, HashOptions } from "../../api/configuration.js";

import fs from "node:fs";

import XLSX from "xlsx";
XLSX.set_fs(fs);

type ConfigReturn = {
  salesCategories: Map<string, string>;
  menuGroups: Map<string, string>;
  restaurantServices: Map<string, string>;
  revenueCenters: Map<string, string>;
  alternatePaymentTypes: Map<string, string>;
  taxRates: Map<string, TaxRates>;
  serviceCharges: Map<string, ServiceCharge>;
};

const PAYMENTS = [
  "CASH",
  "GIFTCARD",
  "HOUSE_ACCOUNT",
  "REWARDCARD",
  "LEVELUP",
  "OTHER",
  "UNDETERMINED",
  "VISA",
  "MASTERCARD",
  "AMEX",
  "DISCOVER",
  "JCB",
  "DINERS",
  "CITI",
  "MAESTRO",
  "LASER",
  "SOLO",
  "INTERAC",
  "UNKNOWN",
] as const;

const MAPTYPES = [
  "Payment",
  "Sales Category",
  "Menu Group",
  "Tips",
  "Tax",
  "Service Charge",
] as const;

/**
 * Creates .XLSM file for Mapping
 * @param api
 * @param property
 * @param filePath
 */
export default async function createMappingFile(
  api: Toast,
  property: string,
  filePath?: string
): Promise<void> {
  try {
    await api.initialize();
  } catch (error) {
    throw Error("API initialization error", { cause: error });
  }
  const customHash: HashOptions = {
    revenueCenters: "name",
    menuGroups: "name",
    salesCategories: "name",
    restaurantServices: "name",
    alternatePaymentTypes: "name",
  };
  const configApi = new Configuration(api, property);
  const configItems: ItemsEnum[] = [
    "revenueCenters",
    "menuGroups",
    "salesCategories",
    "restaurantServices",
    "taxRates",
    "serviceCharges",
    "alternatePaymentTypes",
  ];
  let settings: ConfigReturn | undefined;
  try {
    settings = await configApi.getConfig<ConfigReturn>(configItems, customHash);
  } catch (error) {
    console.error(error);
    throw Error("Error fetching configurations.");
  }
  const revenueCenters = [...settings.revenueCenters.values()];
  const salesCategories = [...settings.salesCategories.values()];
  const menuGroups = [...settings.menuGroups.values()];
  const taxValues = [...settings.taxRates.values()].map((x) => x.name);
  const mealPeriods = [...settings.restaurantServices.values()];

  const wb = XLSX.utils.book_new();

  const mapWS = XLSX.utils.aoa_to_sheet([
    ["Type", "Key 1", "Key 2", "Key 3", "Custom Description", "GL"],
  ]);

  const maxLength = Math.max(
    PAYMENTS.length,
    revenueCenters.length,
    salesCategories.length,
    menuGroups.length,
    taxValues.length,
    mealPeriods.length
  );
  let mapSheetAOA: any = [];
  for (let i = 0; i < maxLength; i++) {
    let newRow = [];
    newRow[0] = MAPTYPES[i];
    newRow[1] = PAYMENTS[i] ?? "";
    newRow[2] = revenueCenters[i] ?? "";
    newRow[3] = mealPeriods[i] ?? "";
    newRow[4] = salesCategories[i] ?? "";
    newRow[5] = menuGroups[i] ?? "";
    newRow[6] = taxValues[i] ?? "";

    console.log(`Row ${i}`, newRow);
    mapSheetAOA.push(newRow);
  }

  const keysWS = XLSX.utils.aoa_to_sheet(mapSheetAOA);

  XLSX.utils.book_append_sheet(wb, mapWS, "Mapping");
  XLSX.utils.book_append_sheet(wb, keysWS, "Keys");

  const blob = fs.readFileSync("validation.bin");
  wb.vbaraw = blob;

  try {
    XLSX.writeFile(wb, `${filePath || "Mapping"}.xlsm`, { bookVBA: true });
  } catch (error: any) {
    if (error.message.startsWith("EBUSY")) {
      console.error("File Open");
    } else {
      console.error(error);
    }
  }
}

//TESTING: CREATE TEMPLATE FILE
(async function () {
  const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
  const api: Toast = new Toast(credentials);
  try {
    await createMappingFile(
      api,
      "0ada05d6-ee20-4c08-bbaf-fe575ebe8179",
      "CAR Mapping"
    );
  } catch (err) {
    console.error(err);
  }
})();
