const axios = require('axios');
const Papa = require('papaparse');

exports.handler = async (event, context) => {
  // Step 1: Accept a variable called "erd"
  // const erd = event.erd;
  const { name = "erd" } = event.queryStringParameters;

  try {
    // Step 2: Reference a static URL and import the CSV at this URL
    const csvUrl = 'https://raw.githubusercontent.com/jacksmedia/hriapp/main/HolderHRI.csv';
    const response = await axios.get(csvUrl);

    // Parse the CSV content using PapaParse
    const parsedCsv = Papa.parse(response.data, { header: true });

    // Step 3: Find and return the value in Column B that matches the "erd" in Column A
    const matchedRow = parsedCsv.data.find((row) => row['Owner'] === erd);

    if (matchedRow) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: matchedRow['HRI'] }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'HRI Value not found in the golden CSV.' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' }),
    };
  }
};
