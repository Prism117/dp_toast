import Toast from "../api/toast.js";
import fs from "node:fs";
//third-party
import XLSX from "xlsx";
XLSX.set_fs(fs);
//project imports
import { GetOrderData } from "./apiData.js";
import { MapOrderData } from "./journal.js";
import { createCSV } from "../util/io/sheetjs.js";
//TESTING: RUN
async function main(prop, date) {
    //Load Configuration
    const properties = JSON.parse(fs.readFileSync("./properties.json", "utf-8"));
    const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
    const api = new Toast(credentials);
    //PARAMS
    const property = properties[prop];
    const runDate = new Date(date);
    const businessDate = runDate.toISOString().slice(0, 10).replaceAll("-", "");
    //* ACQUIRE MAPPING DATA
    //! JSON OR XLSM
    // const jsonMapping = JSON.parse(
    //   fs.readFileSync("mapper.json", { encoding: "utf-8" })
    // );
    const wb = XLSX.readFile("mapping.xlsm");
    const ws = wb.Sheets["Mapping"];
    const wsData = XLSX.utils.sheet_to_json(ws, { raw: false });
    const mappedData = wsData.map((x) => ({
        gl: x.GL,
        type: x.Type,
        key1: x["Key 1"],
        key2: x["Key 2"],
        key3: x["Key 3"],
        customDescription: x["Custom Description"],
    }));
    //* GET API DATA
    const result = await GetOrderData(api, property, businessDate);
    //* MAP API DATA to Journal
    const je = await MapOrderData(result.mappedItems, result.itemProps, mappedData, runDate);
    console.log("JE", je);
    //* EXPORT FILE
    await createCSV(je, "Journal");
}
main(process.argv[2], process.argv[3]);
