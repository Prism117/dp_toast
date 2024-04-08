import Configuration from "./configuration.js";
import Orders from "./order.js";
//Potentially External
import Toast from "./toast.js";
import fs from "node:fs";
const credentials = {
    hostname: "",
    clientID: "",
    clientSecret: "",
};
/**
 * Converts Toast Data to DataPlus Jounral
 * @param property{string} - GUID from Toast 000-00000-00000-0000
 * @param businessDate{string} - yyyymmdd
 */
async function DPJournal(api, property, businessDate) {
    //Initialize API
    try {
        await api.initialize();
    }
    catch (err) {
        console.error(err);
    }
    //Build Route Classes
    const ordersApi = new Orders(api, property);
    const configApi = new Configuration(api, property);
    //Get Configurations
    const customHash = {
        revenueCenters: "name",
        menuGroups: "name",
        salesCategories: "name",
        restaurantServices: "name",
    };
    const configItems = [
        "revenueCenters",
        "menuGroups",
        "salesCategories",
        "restaurantServices",
        "taxRates",
        "serviceCharges",
    ];
    let settings;
    try {
        settings = await configApi.getConfig(configItems, customHash);
    }
    catch (error) {
        console.error(error);
        throw Error("Error fetching configurations.");
    }
    //Get Orders
    let orders;
    try {
        orders = await ordersApi.getMultiOrders({
            businessDate,
        });
    }
    catch (error) {
        console.error(error);
        throw Error("Error fetching orders.");
    }
    if (!orders) {
        throw Error("No Orders");
    }
    //Parse Orders
    let items = []; //For Net Revenue & Taxes
    let payments = []; //For cash items & tips
    let covers = []; //{reven}
    for (const order of orders.slice(0, 3)) {
        //Order-level Params
        const revenueCenter = settings.revenueCenters.get(order.revenueCenter.guid);
        const mealPeriod = settings.restaurantServices.get(order.restaurantService.guid);
        //Handle Covers
        const numGuests = order.numberOfGuests;
        //NOT Voided Check/Order
        if (order.checks.filter((x) => x.voided).length != order.checks.length) {
            const guestIndex = covers.findIndex((x) => x.revenueCenter == revenueCenter && x.mealPeriod == mealPeriod);
            if (guestIndex != -1) {
                covers[guestIndex].guests += numGuests;
            }
            else {
                covers.push({ revenueCenter, mealPeriod, guests: numGuests });
            }
        }
        //Check-level
        for (const check of order.checks) {
            if (check.voided)
                continue;
            //Balancing items
            const { taxAmount, totalAmount, netAmount } = check;
            //TESTING: Track Check
            const checkNo = check.displayNumber;
            console.log("Check #", checkNo);
            //Handle Check Items
            for (const item of check.selections) {
                if (item.voided)
                    continue;
                for (const modifier of item.modifiers) {
                    if (modifier.receiptLinePrice != 0) {
                        console.log("MODIFIER", modifier);
                    }
                    const salesCategory = settings.salesCategories.get(item.salesCategory.guid);
                    const menuGroup = settings.menuGroups.get(item.itemGroup.guid);
                    for (const tax of item.appliedTaxes) {
                    }
                    items.push({
                        name: item.displayName,
                        revenueCenter,
                        mealPeriod,
                        salesCategory,
                        menuGroup,
                        price: item.receiptLinePrice,
                    });
                }
            }
            //Handle Check Payments
            for (const payment of check.payments) {
                const { tipAmount, amount } = payment;
                const payType = payment.type === "CREDIT" ? payment.cardType : payment.type;
                const payIndex = payments.findIndex((x) => x.type == payType);
                if (payIndex != -1) {
                    payments[payIndex].total += amount;
                    payments[payIndex].tipAmount += tipAmount;
                }
                else {
                    payments.push({ type: payType, total: amount, tipAmount });
                }
            }
            return {
                items,
                payments,
                covers,
            };
        }
    }
}
//TESTING: RUN
(async function Test() {
    const properties = {
        828: "9c8dc9a8-4618-4085-b127-cebf13db6d15",
        830: "6c69a54c-8647-4f95-8f41-7df9e0145099",
        825: "0ada05d6-ee20-4c08-bbaf-fe575ebe8179",
    };
    const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
    const test = 0;
    const api = new Toast(credentials);
    const property = properties[830];
    const businessDate = "20240331";
    const result = await DPJournal(api, property, businessDate);
    console.log("RESULT", result);
})();
export default DPJournal;
