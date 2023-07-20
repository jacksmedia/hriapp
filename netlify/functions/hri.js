const axios = require('axios');
const Papa = require('papaparse');

exports.handler = async (event, context) => {
  // Step 1: Accept a variable called "erd", to match w Column A
  // const erd = "erd159mypt4myss3mqrs89ft0hjeacffks2690gq9u3mlh73m9sh0w5s09eqhh";
  const { erd = "Anonymous" } = event.queryStringParameters;

  try {
    // Step 2: Reference a static URL & import the CSV at this URL
    const csvUrl = 'https://raw.githubusercontent.com/jacksmedia/hriapp/main/HolderHRI.csv';
    const response = await axios.get(csvUrl);

    // Parse the CSV content using PapaParse
    const parsedCsv = Papa.parse(response.data, { header: true });

    // Step 3: Find row that matches the Owner "erd" in Column A
    const matchedRow = parsedCsv.data.find((row) => row['Owner'] === ${erd});

    if (matchedRow) { // return the HRI value in Column B
      return {
        statusCode: 200,
        body: JSON.stringify({ result: matchedRow['HRI'] }),
      };
    } else { // report data not found in CSV
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'HRI Value not found in the golden CSV.' }),
      };
    }
  } catch (error) { // report error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error, stay tuned.' }),
    };
  }
};
