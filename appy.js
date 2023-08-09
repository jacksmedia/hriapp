const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

const csvFilePath = 'HolderHRI.csv'; // point to the component dir!

// app.use(csv()); // middleware invoked huzzah

// GET http handler
app.get('/hri/:entry', (req, res) => {
	const entry = req.params.entry;

	// read, search CSV data
	const results = [];
	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			if (row['Owner'] === entry) {
				results.push(row['HRI'])
			}
		})
		.on('end', () => {
			if (results.length > 0) {
				res.json({ match: results });
			} else {
				res.status(404).json({ error: 'This erd Holder Rank Index was not found.'});
			}
		});
});

// start server
app.listen(PORT, () => {
	console.log(`Server listens on port ${PORT}`)
});
	