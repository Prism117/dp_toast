import Toast from "../../api/toast.js";
import fs from "node:fs";
import XLSX from "xlsx";
import createMappingFile from "./mappingFile.js";
async function main() {
    const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
    const api = new Toast(credentials);
    try {
        await createMappingFile(api, "0ada05d6-ee20-4c08-bbaf-fe575ebe8179", "CAR Mapping");
    }
    catch (err) {
        console.error(err);
    }
}
async function extractVBA() {
    const file = fs.readFileSync("Validation Macros.xlsm");
    const wb = XLSX.read(file, {
        bookVBA: true,
        type: "buffer",
    });
    if (!wb.vbaraw)
        throw new Error("No VBA");
    fs.writeFileSync("validation.bin", wb.vbaraw);
}
main();
