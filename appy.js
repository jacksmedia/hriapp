const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

const csvFilePath = 'HolderHRI.csv'; // point to the component dir!

// GET http handler
app.get('/hri/:entry', (req, res) => {
	const entry = req.params.entry;

	// read, search CSV data
	let results = [];
	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			if (row['Owner'] === entry) {
				results.push(row['HRI'])
			}
		})
		.on('end', () => {
			if (results.length > 0) { // all ranks assigned
				if (results < 5.49) {
			        results = "Alpha";
			    } else if (results >= 5.5 && results <= 8.19) {
			        results = "Prime";
			    } else if (results >= 8.2 && results <= 9.99) {
			        results = "Royal";
			    } else if (results >= 10 && results <= 24.99) {
			        results = "Sage";
			    } else if (results >= 25 && results <= 49.99) {
			        results = "Mentor";
			    } else {
			        results = "Innovator";
			    }
				res.json({ rank: results });
			} else {
				res.status(404).json({ error: 'This erd Holder Rank Index was not found.'});
			}
			console.log(results);
		});
});

// start server
app.listen(PORT, () => {
	console.log(`Server listens on port ${PORT}`)
});
	