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
	let rmTheseRanks = [];
	let addThisRank = [];
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
				const Innovator = "932291483845918720";
				const Mentor = "932291519497510922";
				const Sage = "932291554779992124";
				const Royal = "932291594105790544";
				const Prime = "951930951477375016";
				const Alpha = "977151467871932426";
				//
				if (results < 5.49) {
			        // results = "977151467871932426";
			        addThisRank.push(Alpha);
			        rmTheseRanks = [Innovator, Mentor, Sage, Royal, Prime];
			    } else if (results >= 5.5 && results <= 8.19) {
			        addThisRank.push(Prime);
			        rmTheseRanks = [Innovator, Mentor, Sage, Royal, Alpha];
			    } else if (results >= 8.2 && results <= 9.99) {
			        addThisRank.push(Royal);
			        rmTheseRanks = [Innovator, Mentor, Sage, Prime, Alpha];
			    } else if (results >= 10 && results <= 24.99) {
			        addThisRank.push(Sage);
			        rmTheseRanks = [Innovator, Mentor, Royal, Prime, Alpha];
			    } else if (results >= 25 && results <= 49.99) {
			        addThisRank.push(Mentor);
			        rmTheseRanks = [Innovator, Sage, Royal, Prime, Alpha];
			    } else {
			        addThisRank.push(Innovator);
			        rmTheseRanks = [Mentor, Sage, Royal, Prime, Alpha];
			    }
				// return Rank to Add, Ranks to Remove
				res.json({
					assign: addThisRank,
					remove: rmTheseRanks 
				});
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
	