//project imports
import Configuration, { ItemsEnum, HashOptions } from "../api/configuration.js";
import Orders from "../api/order.js";
//third-party
import chalk from "chalk";
//Potentially Move External
import Toast from "../api/toast.js";

//Types
import { MultiOrderReturn, AppliedDiscounts } from "../Types/type_orders.js";
import { TaxRates, ServiceCharge } from "../Types/type_configuration.js";
import { ItemProps, MappableItems } from "../Types/type_journal.js";

type ConfigReturn = {
  salesCategories: Map<string, string>;
  menuGroups: Map<string, string>;
  restaurantServices: Map<string, string>;
  revenueCenters: Map<string, string>;
  alternatePaymentTypes: Map<string, string>;
  taxRates: Map<string, TaxRates>;
  serviceCharges: Map<string, ServiceCharge>;
};

/**
 * Parses Order Data to be used in Journal
 * @param api{class} - API Caller
 * @param property{string} - GUID from Toast 000-00000-00000-0000
 * @param businessDate{string} - yyyymmdd
 */
export async function GetOrderData(
  api: Toast,
  property: string,
  businessDate: string
) {
  //Initialize API
  try {
    await api.initialize();
  } catch (err) {
    console.error(err);
  }

  //Build Route Classes
  const ordersApi = new Orders(api, property);
  const configApi = new Configuration(api, property);

  //Get Configurations

  //Just return this property (ie. name)
  const customHash: HashOptions = {
    revenueCenters: "name",
    menuGroups: "name",
    salesCategories: "name",
    restaurantServices: "name",
    alternatePaymentTypes: "name",
  };

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

  //Get Orders
  let orders: MultiOrderReturn[] | undefined;
  try {
    orders = await ordersApi.getMultiOrders({
      businessDate,
    });
  } catch (error) {
    console.error(error);
    throw Error("Error fetching orders.");
  }

  if (!orders) {
    throw Error("No Orders");
  }

  //! RESULTING ITEMS - From Order Drilling
  let mappedItems: MappableItems[] = [];
  let items: ItemProps = new Map();
  //? OR {name: string, amount: number}[]
  let itemTotals: { [key: string]: number } = {};

  let discounts: {
    checkDiscounts: AppliedDiscounts[];
    itemDiscounts: AppliedDiscounts[];
  } = {
    checkDiscounts: [],
    itemDiscounts: [],
  };

  //Parse Orders
  for (const order of orders) {
    //Order-level Properties
    const revenueCenter =
      settings.revenueCenters.get(order.revenueCenter?.guid) || "UNKNOWN RC";
    const mealPeriod =
      settings.restaurantServices.get(order.restaurantService.guid) ||
      "UNKNOWN MP";

    //* Handle Covers
    const numGuests = order.numberOfGuests;
    //NOT Voided Check/Order
    if (order.checks.filter((x) => x.voided).length != order.checks.length) {
      const coverKey = getCoverName(revenueCenter, mealPeriod);
      const guestIndex = mappedItems.findIndex(
        (x) => x.key == coverKey && x.type === "Stats"
      );
      if (guestIndex != -1) {
        mappedItems[guestIndex].amount += numGuests;
      } else {
        mappedItems.push({ key: coverKey, type: "Stats", amount: numGuests });
      }
    }

    //Check-level
    for (const check of order.checks) {
      if (check.voided) continue;

      //TESTING: Track Check
      const checkNo = check.displayNumber;
      console.log(`Check # : ${checkNo}`);

      //Balancing items
      const { taxAmount, totalAmount, netAmount } = check;

      for (const sc of check.appliedServiceCharges) {
        console.log(
          chalk.blueBright(
            `SC - Grat: ${sc.gratuity}, Name: ${sc.name}, Amount: ${sc.chargeAmount}`
          )
        );

        if (!sc.gratuity) {
          const scKey = getItemName(revenueCenter, mealPeriod, sc.guid);
          items.set(scKey, {
            salesCategory: sc.name,
            menuGroup: undefined,
            name: sc.name,
          });

          if (itemTotals.hasOwnProperty(scKey)) {
            itemTotals[scKey] += sc.chargeAmount;
          } else {
            itemTotals[scKey] = sc.chargeAmount;
          }
        } else {
          //TODO: Handle SC - Def. need to address
        }
      }

      //(Unused) Handle Check Discounts - Just for Costing
      for (const disc of check.appliedDiscounts) {
        if (disc.discountAmount > 0) {
          discounts.checkDiscounts.push(disc);
        }
      }

      //Handle Check Items
      for (let i = 0; i < check.selections.length; i++) {
        const item = check.selections[i];
        if (item.voided) continue;
        //Handle Sales Category
        let salesCategory: string | undefined;
        if (!item.salesCategory) {
          if (item.selectionType == "OPEN_ITEM") {
            salesCategory = `OPEN ITEM - ${item.displayName}`;
          } else {
            throw Error("Sales Category Error");
          }
        } else {
          salesCategory = settings.salesCategories.get(item.salesCategory.guid);
        }
        const menuGroup = settings.menuGroups.get(item.itemGroup?.guid);

        //? NEEDED? Handle Modifiers - Rolled into item.price
        for (const modifier of item.modifiers) {
          if (modifier.receiptLinePrice != 0 && !modifier.voided) {
            // console.log("MODIFIER", modifier);
          }
        }

        //(Unused) Handle Item Discounts - Just for Costing
        for (const itemDisc of item.appliedDiscounts) {
          if (itemDisc.discountAmount > 0) {
            discounts.itemDiscounts.push(itemDisc);
          }
        }

        //* Handle Taxes
        for (const tax of item.appliedTaxes) {
          const taxesIndex = mappedItems.findIndex(
            (x) => x.key === tax.name && x.type === "Tax"
          );
          if (taxesIndex === -1) {
            mappedItems.push({
              key: tax.name,
              amount: tax.taxAmount,
              type: "Tax",
            });
          } else {
            mappedItems[taxesIndex].amount += tax.taxAmount;
          }
        }

        const itemKey = getItemName(revenueCenter, mealPeriod, item.guid);
        if (itemTotals.hasOwnProperty(itemKey)) {
          itemTotals[itemKey] += item.price;
        } else {
          itemTotals[itemKey] = item.price;
        }

        //TESTING
        if (items.has(itemKey)) {
          const cItem = items.get(itemKey);
          console.log(
            chalk.yellow(
              `Current: ${cItem}\nNew: ${salesCategory} | ${menuGroup} | ${item.displayName}
            }`
            )
          );
        }

        items.set(itemKey, {
          salesCategory,
          menuGroup,
          name: item.displayName,
        });
      } //Close Item Scope

      //Handle Check Payments
      for (const payment of check.payments) {
        const { tipAmount, amount } = payment;
        const totalAmt = amount + tipAmount;
        let payType: string =
          payment.type === "CREDIT" ? payment.cardType : payment.type;
        if (payType == "OTHER") {
          payType =
            settings.alternatePaymentTypes.get(payment.otherPayment.guid) ||
            "UNKNOWN OTHER PAYMENT";
        }

        const payIndex = mappedItems.findIndex(
          (x) => x.key === payType && x.type === "Payment"
        );
        if (payIndex != -1) {
          mappedItems[payIndex].amount += totalAmt;
        } else {
          mappedItems.push({ key: payType, amount: totalAmt, type: "Payment" });
        }

        //Handle Tips
        const tipIndex = mappedItems.findIndex(
          (x) => x.type === "Tips" && x.key === "CC Tips"
        );
        if (tipIndex != -1) {
          mappedItems[tipIndex].amount += tipAmount;
        } else {
          mappedItems.push({ key: "CC Tips", amount: tipAmount, type: "Tips" });
        }
      } //Close Payment Scope
    } //Close Check Scope
  } //Close Order Scope

  //Handle Items
  for (const itemKey in itemTotals) {
    mappedItems.push({
      type: "Item",
      key: itemKey,
      amount: itemTotals[itemKey],
    });
  }

  return { mappedItems, itemProps: items };
}

function getItemName(
  revCenter: string,
  mealPeriod: string,
  id: string
): string {
  return `${revCenter}|${mealPeriod}|${id}`;
}

function getCoverName(revCenter: string, mealPeriod: string): string {
  return `Covers - ${revCenter} ${mealPeriod}`;
}
