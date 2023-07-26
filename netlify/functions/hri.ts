import * as fs from 'fs';
import Papa from 'papaparse';


// Assuming the data is stored in a CSV file with headers "Owner" and "HRI"
interface DataEntry {
  Owner: string;
  HRI: string;
}
exports.handler = async (event,context, input: string): Promise<string | null> => {
  try {
    const data = Papa.parse(fs.readFileSync('HolderHRI.csv', 'utf-8'), { header: true }).data as DataEntry[];

    const matchingEntry = data.find((entry) => entry.Owner === input);
    if (matchingEntry) {
      return {
        statusCode: 200,
        body: matchingEntry.HRI,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        };
    } else {
      return {
        statusCode: 403,
        body: 'No HRI data.',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        }
    }
  } catch (error) {
    console.error('Error:', error);
    return {
        statusCode: 502,
        body: 'I am error.',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        }
  }
};
