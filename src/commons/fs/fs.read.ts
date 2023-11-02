import { readFileSync } from "fs";


export function readFile() {
  const csvFile = "/api/data.csv";
  const csvData = readFileSync(csvFile, 'utf-8');
  const csvRows = csvData.replace(" ", "").split('\n');
  const results = [];

  for (const row of csvRows) {
    const [dosi, sgg, lon, lat] = row.replace('\r', '').split(',');
    results.push({ dosi , sgg, lon: Number(lon), lat: Number(lat) });
  }

  return results;
}




