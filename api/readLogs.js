const fs = require('fs');


// Считываю логи из logs.txt и записываю построчно в массив data для дальнейшей работы с ними
let data = fs.readFileSync('logs.txt', 'utf8', (err, file) => {
    if (err)
        console.log(err);
});

data = data.split('\n')

module.exports = data;