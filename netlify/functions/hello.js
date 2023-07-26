exports.handler = async (event, context) => {
  const { name = "Anonymous" } = event.queryStringParameters;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}!`}),
  };
};