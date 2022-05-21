const fs = require('fs');
const path = require('path');
const {stdout} = process;
const readStreem = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStreem.on('data',  chunk => {
  stdout.write(chunk);
});