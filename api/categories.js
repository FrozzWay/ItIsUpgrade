const data = require('./readLogs.js');
const models = require('../models/model');

// Поиск и сохранение категорий в бд

async function SaveCategories() { 

    const categories = new Set();
    for (key in data) {
        const str = data[key];
        a = str.lastIndexOf('bottom.com') + 11
        b = str.indexOf('/',a);
        name = str.slice(a,b);
        if (name.slice(0,3) != 'pay' && name.slice(0,4) != 'cart' && name.slice(0,7) != 'success' && str[a+1] != undefined)
            categories.add(name);
    };

    for (key of categories) {
        const model = new models[3]({
            name: key
        })
        await model.save();
    };
}

module.exports = SaveCategories;