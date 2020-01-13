const {Schema, model} = require('mongoose');

const requests = new Schema({
    time: {
        type: Object,
        required: true
    }
})

const completedPurchases = new Schema({
    time: {
        type: Object,
        required: true
    },
    ip: {
        type: String,
        required: true
    }
})

const watchedCategory = new Schema({
    time: {
        type: Object,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

const categories = new Schema({
    name: {
        type: String,
        required: true
    }
})



models = [
    model('Requests', requests),
    model('completedPurchases', completedPurchases),
    model('watchCategory', watchedCategory),
    model('Categories', categories)
]
module.exports = models;