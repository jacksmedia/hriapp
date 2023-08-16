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
			if (results.length > 0) { 
			// all ranks assigned upon Discord Role IDs
			//Innovator: 932291483845918720
			//Mentor: 932291519497510922
			//Sage: 932291554779992124
			//Royal: 932291594105790544
			//Prime: 951930951477375016
			//Alpha: 977151467871932426
			//
			//
				if (results < 5.49) {
			        results = "977151467871932426";
			    } else if (results >= 5.5 && results <= 8.19) {
			        results = "951930951477375016";
			    } else if (results >= 8.2 && results <= 9.99) {
			        results = "932291594105790544";
			    } else if (results >= 10 && results <= 24.99) {
			        results = "932291554779992124";
			    } else if (results >= 25 && results <= 49.99) {
			        results = "932291519497510922";
			    } else {
			        results = "932291483845918720";
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
	