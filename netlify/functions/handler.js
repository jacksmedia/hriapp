// YOUR_BASE_DIRECTORY/netlify/functions/handler.js

const { schedule } = require("@netlify/functions");

const handler = async function(event, context) {
    console.log("Received event:", event);
    console.log('Printing this message every hour. What a world!')
    source localdaemon.sh
    
    return {
        statusCode: 200,
    };
};

exports.handler = schedule("@hourly", handler);