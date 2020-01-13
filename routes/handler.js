const express = require('express');
const router = express.Router();
const models = require('../models/model');

/* GET requests page. */
router.get('/requests', function (req, res) {
    res.render('requests', {title: 'Кол-во запросов за час'});
});
// Get main page.
router.get('/', function (req, res) {
    res.render('index', {});
});
// Get repeated purchases page.
router.get('/repeatedPurchases', function (req, res) {
    res.render('repeatedPurchases', {title: "Повторные покупки за период"});
});




router.post('/requests', async function(req, res) {
    // Получаю коллекцию request из базы данных
    const requests = await models[0].find({});
    // firstTime - время начала интервала, которое указал пользователь, lastTime - конец астрономич. часа
    const firstTime = new Date(req.body.time);
    let lastTime = new Date(req.body.time);
    lastTime.setHours(lastTime.getHours() + 1);
    let n1, n2;
    console.log(`F time${firstTime}`);
    console.log(`L Time${lastTime}`);
    // Перебираю запросы.
    for (key = 0; key < requests.length - 1; key++) {
        //console.log(`${requests[key].time}`);
        if (firstTime >= requests[key].time && firstTime < requests[key+1].time) {
            n1 = key + 1;
            console.log(n1)
        }
        if (lastTime >= requests[key].time && lastTime < requests[key+1].time) {
             n2 = key + 1;
            console.log(n2)
        }
    };
    if (firstTime < requests[0].time) n1 = 0;
    lastItem = requests.length - 1
    if (lastTime > requests[lastItem].time) n2 = lastItem;
    result = n2 - n1 + 1;
    res.render('response-requests', {
        title: result,
        result
    })
});




router.post('/repeatedPurchases', async (req, res) => {
    // Получаю коллекцию completedPurchases из БД
    const completedPurchases = await models[1].find({});
    // Определяю период
    const firstTime = new Date(req.body.firstTime);
    const lastTime = new Date(req.body.lastTime);
    let n1, n2;
    // Перебираю коллекцию для определения первого(n1) и последнего(n2) номера элемента периода
    for (key = 0; key < completedPurchases.length - 1; key++) {
        if (firstTime >= completedPurchases[key].time && firstTime < completedPurchases[key+1].time) {
            n1 = key + 1;
        }
        if (lastTime >= completedPurchases[key].time && lastTime < completedPurchases[key+1].time) {
             n2 = key;
        }
    };
    if (firstTime < completedPurchases[0].time) n1 = 0;
    lastItem = completedPurchases.length - 1
    if (lastTime >= completedPurchases[lastItem].time) n2 = lastItem;
    // Определяю кол-во повторных покупок
    let k = 0;
    let buyers = new Set();
    for (key = n1; key < n2 + 1; key++) {
        currentIp = completedPurchases[key].ip
        if (buyers.has(currentIp)) k++;
        else buyers.add(currentIp);
    };
    res.render('response-repeatedPurchases', {
        title: k,
        k
    })
})

router.get('/watchedCategories', async (req, res) => {
    // Получение списка категорий с бд
    const cat = await models[3].find({});
    let categories = [];
    for (key in cat) categories.push(cat[key].name);
    res.render('watchedCategories', {
        categories
    });
})

router.post('/watchedCategories', async (req, res) => {
    const choosenCategory = req.body.category;
    // Получение списка категорий с бд
    const cat = await models[3].find({});
    let categories = new Set();
    for (key in cat) categories.add(cat[key].name);
    // Получение всех обращений к категориям(watchcategories) из бд
    const watchcategories = await models[2].find({});
    // *Времена суток*
    const timeIntervals = {
        a: {
            begin: 0,
            end: 6
        },
        b: {
            begin: 6,
            end: 12
        },
        c: {
            begin: 12,
            end: 18
        },
        d: {
            begin: 18,
            end: 24
        }
    };

    // Каждая категория содержит информацию о том, сколько !уникальных! посещений произошло в каждом временном интервале(timeIntervals)
    const info = {};
    for (key of categories) {
        info[key] = {
            a: {
                value: 0,
                ip: new Set()
            },
            b: {
                value: 0,
                ip: new Set()
            },
            c: {
                value: 0,
                ip: new Set()
            },
            d: {
                value: 0,
                ip: new Set()
            }
        };
    }


    // Перебираю обращения
    for (key in watchcategories) {

        // Получаю в каком часу произошёл запрос и остальные данные запроса
        const hour = watchcategories[key].time.getHours();
        const category = watchcategories[key].category;
        const currentIp = watchcategories[key].ip;

        // Определяю в каком временном интервале произошёл запрос
        for (key in timeIntervals) {           
            if (hour >= timeIntervals[key].begin && hour < timeIntervals[key].end) {
                // Проверка на уникальность(один человек - один балл в категорию)
                if (!info[category][key].ip.has(currentIp)) {
                    info[category][key].value++;
                    info[category][key].ip.add(currentIp)
                }
            }
        }
    };

    // Подготовка ответа
    max = info[choosenCategory].a.value;
    i = 'a';
    for (key in info[choosenCategory]) {
        if (info[choosenCategory][key].value > max) { max = info[choosenCategory][key].value; i = key; }
    }
    switch (i) {
        case 'a':
             result = '00:00 - 6:00';
             break;
        case 'b':
            result = '6:00 - 12:00';
            break;
        case 'c':
            result = '12:00 - 18:00';
            break;
        case 'd':
            result = '18:00 - 00:00';
            break;
    }
    res.render('response-watchedCategories', {
        title: 'af',
        result
    })

})


module.exports = router;
