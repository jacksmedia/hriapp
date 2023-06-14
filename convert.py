import csv
import json
import argparse

# Inputs
parser = argparse.ArgumentParser()
parser.add_argument("--csv_name", help="CSV file name (input)", required=True)
parser.add_argument("--json_name", help="JSON file name (output)", required=True)
args = parser.parse_args()

def csv_to_json(csv_file_path, json_file_path):
	#create a dictionary
	data_dict = {}

	#Step 2
	#open a csv file handler
	with open(csv_file_path, encoding = 'utf-8') as csv_file_handler:
		csv_reader = csv.DictReader(csv_file_handler)

		#convert each row into a dictionary
		#and add the converted data to the data_variable

		for rows in csv_reader:

			#assuming column 1 to be the primary key
			key = rows[0]
			data_dict[key] = rows

	#open a json file handler and use json.dumps
	#method to dump the data
	#Step 3
	with open(json_file_path, 'w', encoding = 'utf-8') as json_file_handler:
		#Step 4
		json_file_handler.write(json.dumps(data_dict, indent = 4))

#driver code
#be careful while providing the path of the csv file
#provide the file path relative to your machine

#Step 1
csv_file_path = args.csv_name
json_file_path = args.json_name

csv_to_json(csv_file_path, json_file_path)