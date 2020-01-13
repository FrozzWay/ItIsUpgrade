const express = require('express');
const app = express();
const path = require('path');
const exphbr = require('express-handlebars');
const mongoose = require('mongoose');
const models = require('./models/model')

// Connecting Database modules
const SaveRequests = require('./api/[4] saveRequests');
const SaveCompletedPurchases = require('./api/[7] completedPurchases');
const SaveWatchedCategories = require('./api/[3] watchCategory');
const SaveCategories = require('./api/categories');




// Logger init
const logger = function (req, res, next) {
    let time = new Date();
    console.log(`${req.method} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}
app.use(logger);

// JSON init ( разрешает отправку на сервер json)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handlebars init (рендрит html файлы)
app.engine('handlebars', exphbr({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');




// set routes. В папке routes файл handler обрабатывает все запросы к серверу
app.use('/', require('./routes/handler'));





// Add to Database, !дублирование кода! Добавление в базу данных начинается сразу после запуска сервера, если в базе данных нет.
(async function() {

    // Проверка на наличие коллекции request в базе. Пересоздание коллекции занимает достаточно много времени т.к там 24284 записи
    const requests = await models[0].find({});
    if (requests.length > 0)
        console.log('Found "requests" collection in the database');
    else {
        console.log('Uploading "requests" collection to the database... It may take a little while')
        SaveRequests();
    };


    // Проверка на наличие коллекции completedPurchases в базе
    const completedPurchases = await models[1].find({});
    if (completedPurchases.length > 0)
        console.log('Found "completedPurchases" collection in the database');
    else {
        console.log('Uploading "completedPurchases" collection to the database... It may take a little while')
        SaveCompletedPurchases();
    };


    // Проверка на наличие коллекции watchCategory в базе. Эта коллекция тоже долго создаётся.
    const watchedCategory = await models[2].find({});
    if (watchedCategory.length > 0)
        console.log('Found "watchedCategory" collection in the database');
    else {
        console.log('Uploading "watchedCategory" collection to the database... It may take a little while');
        SaveWatchedCategories();
    };

    // Проверка на наличие коллекции Category в базе.
    const Categories = await models[3].find({});
    if (Categories.length > 0)
        console.log('Found "Category" collection in the database');
    else {
        console.log('Uploading "Category" collection to the database... It may take a little while');
        SaveCategories();
    };

})();








// Connect mongo & Run server
async function start() {

    try {
        await mongoose.connect('mongodb+srv://frozzway:1q2w3e4r@cluster0-tn8k0.mongodb.net/IsIt', {
            useNewUrlParser: true,
            useFindAndModify: false
        });
        app.listen(1337, console.log('Server is Running'));
    } catch (e) {
        console.log(e);
    }

}
start();