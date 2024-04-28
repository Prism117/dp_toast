/**
 * Converts Order Data into DP-style journal
 * @param {Object} data
 * @param {Object[]} mapping
 */
//! As items get mapped remove from values
export async function MapOrderData(data, itemProps, mapping, date) {
    let journal = new Array();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    for (const mappedItem of mapping) {
        console.log("Data Length", data.length);
        switch (mappedItem.type) {
            case "Sales Category" || "Menu Group": {
                const items = data.filter((x) => x.type === "Item");
                let mappedKeys = [];
                for (const item of items) {
                    const [revCenter, mealPeriod] = item.key.split("|");
                    const { salesCategory, menuGroup } = itemProps.get(item.key) || {};
                    if (revCenter === mappedItem.key1 && mealPeriod === mappedItem.key2) {
                        let description;
                        if (mappedItem.type === "Sales Category") {
                            if (salesCategory === mappedItem.key3) {
                                description = `${revCenter} ${mealPeriod} ${salesCategory}`;
                            }
                        }
                        else {
                            if (menuGroup === mappedItem.key3) {
                                description = `${revCenter} ${mealPeriod} ${menuGroup}`;
                            }
                        }
                        //Not a Match
                        if (!description) {
                            continue;
                        }
                        if (mappedItem?.customDescription) {
                            description = mappedItem.customDescription;
                        }
                        const jeIndex = journal.findIndex((x) => x.description === description);
                        if (jeIndex === -1) {
                            journal.push({
                                gl: mappedItem.gl,
                                amount: item.amount,
                                date,
                                description,
                                month,
                                year,
                                journalCode: "TOAST",
                            });
                        }
                        else {
                            journal[jeIndex].amount += item.amount;
                        }
                        mappedKeys.push(item.key);
                    }
                }
                data = data.filter((x) => !mappedKeys.includes(x.key));
            }
            case "Payment": {
                const { key1: payKey, gl } = mappedItem;
                const payData = data.find((x) => x.type === "Payment" && x.key === payKey);
                if (!payData) {
                    continue;
                }
                const jeIndex = journal.findIndex((x) => x.description === payKey);
                if (jeIndex === -1) {
                    journal.push({
                        gl,
                        amount: payData.amount,
                        date,
                        description: payKey,
                        month,
                        year,
                        journalCode: "TOAST",
                    });
                    data = data.filter((x) => x.key != payKey);
                }
                else {
                    throw Error("Duplicate Payment Keys");
                }
            }
        }
    }
    //TODO: Handle Unmapped Items - What's in Data still
    for (const remItem of data) {
    }
    return journal;
}
