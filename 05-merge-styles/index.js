const path = require('path');
const promiseFs = require('fs/promises');
const fs = require('fs');
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');

async function buildStyles(stylesDir, build){
  const files = await promiseFs.readdir(stylesDir, {withFileTypes: true});
  await promiseFs.writeFile(path.join(build, 'bundle.css'), '');
  const output = fs.createWriteStream(path.join(build, 'bundle.css'));
  files.forEach(file => {
    const input = fs.createReadStream(path.join(stylesDir, file.name));
    const ext = path.extname(path.join(styles, file.name));
    if(file.isFile() && ext === '.css'){
      input.pipe(output);
    }
  });
}

buildStyles(styles,dist);