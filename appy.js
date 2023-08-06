const portal = 80;
const express = require('express');
const app = express();
app.use(express.json());

app.listen(portal, function(err) {
	if (err) console.log(err);
	console.log("Server Listens on PORT:", portal)
});
app.get("/status", (request, response) => {
	const status = {
		"Status": "Running"
	};
	response.send(status);
});
