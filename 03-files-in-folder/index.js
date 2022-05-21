const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes:true}, (error, files)=>{
  if(error) console.error(error.message);
  files.forEach(elem => {
    const ext = path.extname(path.join(__dirname, 'secret-folder', elem.name));
    const name = path.basename(path.join(__dirname, 'secret-folder', elem.name), ext);
    fs.stat(path.join(__dirname, 'secret-folder', elem.name), (error,stat)=>{
      if(error) console.error(error.message);
      const size = stat.size;
      if(elem.isFile()){
        console.log(`${name} - ${ext} - ${size}kb`);
      }
    });
  });
});

