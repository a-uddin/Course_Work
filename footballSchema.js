// footballSchema.js
const mongoose = require('mongoose');

// Define Schema to match the CSV columns
const footballSchema = new mongoose.Schema({
  Team: { type: String, required: true },
  GamesPlayed: { type: Number, required: true },
  Win: { type: Number, required: true },
  Draw: { type: Number, required: true },
  Loss: { type: Number, required: true },
  GoalsFor: { type: Number, required: true },
  GoalsAgainst: { type: Number, required: true },
  Points: { type: Number, required: true },
  Year: { type: Number, required: true },
});

// Create a Model with the correct collection name 'footballs'
const Football = mongoose.model('Football', footballSchema, 'footballs');

module.exports = Football;
