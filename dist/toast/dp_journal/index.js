import Toast from "../api/toast.js";
import fs from "node:fs";
import { GetOrderData } from "./apiData.js";
import { MapOrderData } from "./journal.js";
//TESTING: RUN
async function main(prop, date) {
    const properties = {
        828: "9c8dc9a8-4618-4085-b127-cebf13db6d15",
        830: "6c69a54c-8647-4f95-8f41-7df9e0145099",
        825: "0ada05d6-ee20-4c08-bbaf-fe575ebe8179",
    };
    const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
    const api = new Toast(credentials);
    //PARAMS
    const property = properties[prop];
    const runDate = new Date(date);
    const businessDate = runDate.toISOString().slice(0, 10).replace("-", "");
    console.debug("Business Date", businessDate);
    //* GET API DATA
    const result = await GetOrderData(api, property, businessDate);
    //* ACQUIRE MAPPING DATA
    //TODO: Replace with Excel Reader or Web Submitted JSON
    const fakeMapping = JSON.parse(fs.readFileSync("mapper.json", { encoding: "utf-8" }));
    // const wb = XLSX.readFile("input.xlsm");
    // const ws = wb.Sheets["Mapping"];
    // const wsData = XLSX.utils.sheet_to_json(ws);
    //* MAP API DATA to Journal
    const je = await MapOrderData(result.mappedItems, result.itemProps, fakeMapping, runDate);
    console.log("JE", je);
    //* EXPORT FILE
    // await createCSV(je, "Journal");
}
main(825, "2024-04-07");
