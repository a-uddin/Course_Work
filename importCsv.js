// importCsv.js
const mongoose = require('mongoose');
const csv = require('csvtojson');
const Football = require('./footballSchema'); // Ensure this matches your file name

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://lenin3636:coursework1@cluster0.k7xh5.mongodb.net/FootballDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error:', err);
});

// Function to import CSV data
const importData = async () => {
  try {
    const footballData = await csv({
      colParser: {
        "Games Played": "number",
        "Win": "number",
        "Draw": "number",
        "Loss": "number",
        "Goals For": "number",
        "Goals Against": "number",
        "Points": "number",
        "Year": "number",
      },
      headers: ["Team", "Games Played", "Win", "Draw", "Loss", "Goals For", "Goals Against", "Points", "Year"],
      checkType: true
    }).fromFile('./football_data.csv');

    // Map the CSV fields to your schema
    const formattedData = footballData.map(item => ({
      Team: item["Team"],
      GamesPlayed: item["Games Played"],
      Win: item["Win"],
      Draw: item["Draw"],
      Loss: item["Loss"],
      GoalsFor: item["Goals For"],
      GoalsAgainst: item["Goals Against"],
      Points: item["Points"],
      Year: item["Year"]
    }));

    // Insert the formatted data into MongoDB
    await Football.insertMany(formattedData);
    console.log('CSV data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Call the import function
importData();
