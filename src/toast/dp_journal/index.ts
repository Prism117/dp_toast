import Toast from "../api/toast.js";
import fs from "node:fs";
//third-party
import XLSX from "xlsx";
//project imports
import { createCSV } from "../util/io/sheetjs.js";
import { GetOrderData } from "./apiData.js";
import { MapOrderData } from "./journal.js";

//TESTING: RUN
async function main(prop: string, date: string) {
  //Load Configuration
  const properties: { [id: string]: string } = JSON.parse(
    fs.readFileSync("./properties.json", "utf-8")
  );
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
  const fakeMapping = JSON.parse(
    fs.readFileSync("mapper.json", { encoding: "utf-8" })
  );
  // const wb = XLSX.readFile("input.xlsm");
  // const ws = wb.Sheets["Mapping"];
  // const wsData = XLSX.utils.sheet_to_json(ws);

  //* MAP API DATA to Journal
  const je = await MapOrderData(
    result.mappedItems,
    result.itemProps,
    fakeMapping,
    runDate
  );

  console.log("JE", je);

  //* EXPORT FILE
  // await createCSV(je, "Journal");
}

main(process.argv[2], process.argv[3]);
