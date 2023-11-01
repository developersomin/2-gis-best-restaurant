import * as fs from "fs";

export function readFile() {
    const csvFile = 'sgg_lat_lon.json';
    const jsonData = fs.readFileSync(csvFile, 'utf8');
    const data = JSON.parse(jsonData);
    return data;
}
