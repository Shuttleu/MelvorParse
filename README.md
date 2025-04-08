# Melvor Idle save file parser

## About

This is a work in progress project to load, edit and save Melvor Idle save strings.

As of current, this parser will only support save file version 130 (currently the latest version) but the plan is to update for new save file versions as they come out.

## Save string format

The Melvor Idle save string has been optimised for space, so it is not easy to read the contentsof the save string.

Previously the save string was a JSON object that was compressed with gzip, then encoded in base64. This allowed you to decode and decompress the string to get an easy to use JSON object to manipulate.

The new format lists all the variables as individual bytes in a specific order, then zlib deflated and finally base64 encoded.

Due to all the variables now being listed as raw bytes and in a specific order, it has to be read and written in a specific order/way, otherwise the save file will not work.


## Usage

You must use node to use this parser currently, once you have cloned this repo, use `npm install` to install the dependency (fflate), alternatively, you can  download just the `main.js` file and install fflate globally with `npm install -g fflate`

Simply put your save file sting inside the file called `save.txt` and run with node `node main.js`, this will save a file called `parsed.json` with the contents of the save string.

An example output has been uploaded for both the save file and parsed output