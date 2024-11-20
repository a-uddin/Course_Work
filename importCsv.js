// importCsv.js
const mongoose = require('mongoose');
const csv = require('csvtojson');
const Football = require('./footballSchema'); 

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://lenin3636:coursework1@cluster0.k7xh5.mongodb.net/FootballDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Function to import CSV data
const importData = async () => {
  try {
    const footballData = await csv({
      colParser: {
        // colParser tells the CSV parser how to interpret the data for specific columns.
        // By default they are String
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

    // Map the CSV fields to the schema
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
