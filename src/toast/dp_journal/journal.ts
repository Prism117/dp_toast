import {
  ItemProps,
  JournalItem,
  MappableItems,
  MappingArray,
} from "../Types/type_journal.js";

/**
 * Converts Order Data into DP-style journal
 * @param {Object} data
 * @param {Object[]} mapping
 */
//! As items get mapped remove from data
export async function MapOrderData(
  data: MappableItems[],
  itemProps: ItemProps,
  mapping: MappingArray[],
  date: Date
) {
  let journal = new Array<JournalItem>();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateStr = date.toLocaleDateString();
  for (const mappedItem of mapping) {
    console.log("Data Length", data.length);
    switch (mappedItem.type) {
      case "Sales Category" || "Menu Group": {
        const items = data.filter((x) => x.type === "Item");
        let mappedKeys: string[] = [];
        for (const item of items) {
          const [revCenter, mealPeriod] = item.key.split("|");
          const { salesCategory, menuGroup } = itemProps.get(item.key) || {};

          if (revCenter === mappedItem.key1 && mealPeriod === mappedItem.key2) {
            let description: string | undefined;
            if (mappedItem.type === "Sales Category") {
              if (salesCategory === mappedItem.key3) {
                description = `${revCenter} ${mealPeriod} ${salesCategory}`;
              }
            } else {
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

            const jeIndex = journal.findIndex(
              (x) => x.description === description
            );
            if (jeIndex === -1) {
              journal.push({
                gl: mappedItem.gl,
                amount: item.amount,
                reference: "",
                date: dateStr,
                description,
                month,
                year,
                journalCode: "TOAST",
                user: "",
                units: "",
              });
            } else {
              journal[jeIndex].amount += item.amount;
            }
            mappedKeys.push(item.key);
          }
        }
        data = data.filter((x) => !mappedKeys.includes(x.key));
      }

      case "Stats": {
        continue;
      }
      //Skip Keys
      case "Tips": {
        const tipItem = data.find((x) => x.type === "Tips");
        if (!tipItem) {
          continue;
        }
        journal.push({
          gl: mappedItem.gl,
          amount: tipItem?.amount,
          reference: "",
          description: "Tips",
          date: dateStr,
          month,
          year,
          journalCode: "TOAST",
          user: "",
          units: "",
        });
        data = data.filter((x) => x.type !== "Tips");
      }

      default: {
        const { key1: primaryKey, gl } = mappedItem;
        const payData = data.find(
          (x) => x.type === "Payment" && x.key === primaryKey
        );
        if (!payData) {
          continue;
        }
        const jeIndex = journal.findIndex((x) => x.description === primaryKey);
        if (jeIndex === -1) {
          journal.push({
            gl,
            amount: payData.amount,
            reference: "",
            date: dateStr,
            description: primaryKey,
            month,
            year,
            journalCode: "TOAST",
            user: "",
            units: "",
          });
          data = data.filter((x) => x.key != primaryKey);
        } else {
          throw Error("Duplicate Payment Keys");
        }
      }
    }
  }

  //TODO: Handle Unmapped Items - What's in Data still
  for (const remItem of data) {
    let description: string;
    if (remItem.type === "Item") {
      const { salesCategory, menuGroup } = itemProps.get(remItem.key) || {};
      const [revenueCenter, mealPeriod] = remItem.key.split("|");
      description = `Unmapped Item: ${salesCategory} OR ${menuGroup} Rev: ${revenueCenter} MP: ${mealPeriod}`;
      //TODO: Check if already mapped
    } else {
      description = `Unmapped ${remItem.type}: ${remItem.key}`;
    }
    journal.push({
      gl: "999999",
      amount: remItem.type === "Stats" ? 0 : remItem.amount,
      description,
      date: dateStr,
      month,
      year,
      journalCode: "TOAST",
      user: "",
      units: remItem.type === "Stats" ? remItem.amount : "",
    });
  }

  return journal;
}
