const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = process;

const rl = readline.createInterface({ input, output });
fs.createWriteStream(path.join(__dirname,'note.txt'));
output.write('Привет!\n Чтобы сделать запись в файле\n введи текст и нажми Enter\n Чтобы выйти из режима записи нажми CTRL + C или введи - exit\n');
rl.on('line', note =>{
  if(note === 'exit'){
    output.write('Если тебе нужен файл, то сохрани его,\n при следующем выполнении команды он перезапишется!\n Пока!\n');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname,'note.txt'), note, 'utf-8', (error) => { 
      if(error) console.error(error.message);
    });
  }
});
rl.on('SIGINT',()=>{
  output.write(' Если тебе нужен файл, то сохрани его,\n при следующем выполнении команды он перезапишется!\n Пока!\n');
  rl.close();
});