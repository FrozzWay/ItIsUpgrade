const data = require('./readLogs.js');
const models = require('../models/model');
// Сохраняю коллекцию watchCategory в базе данных, содержащую информацию о времени каждого просмотра категории, самой категории, ip

async function SaveWatchedCategories() {

    // Поиск всех возможных категорий и сохранение в set(массив с уник. знач.)
    const categories = new Set();
    for (key in data) {
        const str = data[key];
        a = str.lastIndexOf('bottom.com') + 11
        b = str.indexOf('/',a);
        name = str.slice(a,b);
        if (name.slice(0,3) != 'pay' && name.slice(0,4) != 'cart' && name.slice(0,7) != 'success' && str[a+1] != undefined)
            categories.add(name);
    };


    // Поиск и сохранение данных в базу
    for (key in data) {
        // Вытаскиваем строку
        const str = data[key];

        // Находим время запроса
        const currentDate = str.slice(16, 36);

        // Находим Ip запроса
        a = str.lastIndexOf('INFO:') + 6;
        b = str.lastIndexOf(' ')
        const currentIp = str.slice(a,b);

        // Проверяем строку на наличие посещения категории
        let check = false;
        for (key of categories) {
            if (str.includes(key)) check = true
        }
        if (check) {
            a = str.lastIndexOf('bottom.com') + 11
            b = str.indexOf('/',a);
            // Проверяю строку на просмотр самой категории, а не единицы товара
            if (str[b+1] === '\r') {
                const category = str.slice(a,b);

                // Отправляем в бд
                const model = new models[2]({
                    time: new Date(currentDate),
                    ip: currentIp,
                    category
                });
                await model.save();
            };
        }

    }
};

module.exports = SaveWatchedCategories;