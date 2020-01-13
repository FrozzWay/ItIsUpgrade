const data = require('./readLogs.js');
const models = require('../models/model');
// Сохраняю коллекцию completedPurchases в базе данных, содержащую информацию о времени совершенной покупки и ip
async function completedPurchases() {
    for (key in data) {
        const str = data[key];
        if (str.includes('success_pay')) {

            const currentDate = str.slice(16, 36);
            a = str.lastIndexOf('INFO:') + 6;
            b = str.lastIndexOf(' ')
	        const currentIp = str.slice(a,b);

            const model = new models[1]({
                time: new Date(currentDate),
                ip: currentIp
            });
            await model.save();
        }
    }
};

module.exports = completedPurchases;