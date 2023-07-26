const fs = require('fs');
const Papa = require('papaparse');

exports.handler = async (event, context) => {
  const input = event.queryStringParameters.input;
  if (!input) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Input parameter "input" is missing.' }),
    };
  }

  try {
    // Assuming the data is stored in a CSV file with unknown headers
    const data = Papa.parse(fs.readFileSync('HolderHRI.csv', 'utf-8'), { header: true }).data;

    const matchingEntry = data.find((entry) => entry[Object.keys(entry)[0]] === input);
    if (matchingEntry) {
      const secondColumnValue = matchingEntry[Object.keys(matchingEntry)[1]];
      return {
        statusCode: 200,
        body: JSON.stringify({ result: secondColumnValue }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No matching entry found.' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' }),
    };
  }
};
