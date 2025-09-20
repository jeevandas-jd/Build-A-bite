const mongoose = require('mongoose');
const { create } = require('./Player');
const Schema = mongoose.Schema;


const guestSchema = new Schema({
    uniqueName: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Guest = mongoose.model('Guest', guestSchema);
module.exports = Guest;