const data = require('./readLogs.js');
const models = require('../models/model');
// Сохраняю коллекцию requests в базе данных, содержащую информацию о времени каждого запроса
async function SaveRequests() {
    for (key in data) {
        const currentDate = data[key].slice(16, 36);
        const date = new models[0]({
            time: new Date(currentDate)
        });
        await date.save();
    }
};

module.exports = SaveRequests;