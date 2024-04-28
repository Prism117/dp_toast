import XLSX, { WorkSheet } from "xlsx";

export function createCSV(objectArray: {}[], fileName: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const ws: WorkSheet = XLSX.utils.json_to_sheet(objectArray);
      const wb = XLSX.utils.book_new(ws, "Export");
      await XLSX.writeFile(wb, `${fileName}.csv`, { bookType: "csv" });
      resolve();
    } catch (err) {
      console.error(err);
      reject("Could not save CSV.");
    }
  });
}
