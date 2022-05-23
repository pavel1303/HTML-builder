const promiseFs = require('fs/promises');
const path = require('path');
const dirForCopy = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');
async function copyDir(toCopy, copyHere){
  if(copyHere){
    await promiseFs.rm(copyHere, { recursive: true, force: true });
  }
  await promiseFs.mkdir(copyHere, {recursive: true});
  const files = await promiseFs.readdir(toCopy,{withFileTypes: true});
  files.forEach(file =>{
    if(!file.isDirectory()){
      promiseFs.copyFile(path.join(toCopy, file.name), path.join(copyHere, file.name));
    } else if(file.isDirectory()){
      copyDir(path.join(toCopy, file.name), path.join(copyHere, file.name));
    }
  });
}


copyDir(dirForCopy, targetDir);