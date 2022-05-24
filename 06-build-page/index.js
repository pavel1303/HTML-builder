const path = require('path');
const promiseFs = require('fs/promises');
const fs = require('fs');
buildPage();

async function buildHTML(){
  //Файл с шаблоном HTML
  let sampleHTML = await promiseFs.readFile(path.join(__dirname,'template.html'), 'utf-8');
  //Массив с компонентами
  // const components = await promiseFs.readdir(path.join(__dirname, 'components'));
  //Массив с названиями тегов-шаблонов
  const componentsName = [];
  //Прохожусь по файлу с шаблоном и ищу теги, которые необходимо заменить на компонент
  sampleHTML.split(' ').forEach(elem => {
    let cur = findComponent(elem);
    if(cur !== ''){
      componentsName.push(cur);
    }
  });
  // Создаю объект с контеном компонентов
  let objContent ={};
  await createObjComponents(componentsName, objContent);
  //Собираю новый HTML файл
  //Разбиваю шаблон на строки
  for(let el of sampleHTML.split('\n')){
    if(!el.includes('{{')){
      await promiseFs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), el);
    }else{
      //Выбираем подходящий компонент
      componentsName.forEach(async (component) => {
        let tag = '{{'+`${component}`+'}}';
        if(el.includes(tag)){
          await promiseFs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), objContent[component] );
        }
      });
    }
  }
}
async function buildPage(){
  await promiseFs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  await promiseFs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '');
  //Вызываю функцию копирования для папки assets
  const dirForCopy = path.join(__dirname, 'assets');
  const targetDir = path.join(__dirname, 'project-dist', 'assets');
  copyDir(dirForCopy, targetDir);
  //Вызываю функцию сбора стилей и добавления в проект
  const styles = path.join(__dirname, 'styles');
  const dist = path.join(__dirname, 'project-dist');
  buildStyles(styles, dist);
  //Создаю и наполняю index.html
  buildHTML();
}
//Функчия для поиска компонентов в шаблоне
function findComponent(elem){
  let component = '';
  if(elem.startsWith('{{')){
    let stop = false;
    elem.split('').forEach(char => {
      if(char === '{'){
        component += '';
      } else if (char === '}'){
        stop = true;
      } else{
        if(!stop){
          component += char;
        }
      }
    });
  }
  return component;
}
// Функция для создания объекта с контентом компонентов
async function createObjComponents(names,obj){
  for(let name of names){
    obj[name] = await promiseFs.readFile(path.join(__dirname, 'components', `${name}.html`));
  }
}
//функция для сбора стилей в один бандл
async function buildStyles(stylesDir, build){
  const files = await promiseFs.readdir(stylesDir, {withFileTypes: true});
  await promiseFs.writeFile(path.join(build, 'style.css'), '');
  const output = fs.createWriteStream(path.join(build, 'style.css'));
  files.forEach(file => {
    const input = fs.createReadStream(path.join(stylesDir, file.name));
    const ext = path.extname(path.join(stylesDir, file.name));
    if(file.isFile() && ext === '.css'){
      input.pipe(output);
    }
  });
}
//Функция копирования
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