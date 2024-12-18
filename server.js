// server.js
const express = require('express');
const cors = require('cors'); 
// Import CORS (by default web browser block requests from one domain to another 
//due to security policies known as same-origin policy)
const connectDB = require('./dbConnect');
const Football = require('./footballSchema');

// Initialize the server
const app = express();
connectDB();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); // for parsing JSON data

// Test route
app.get('/', (req, res) => {
  res.send('Server is running...');
  console.log('To check Root route working');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// GET: to Fetch All Records
app.get('/api/footballs', async (req, res) => {
  try {
    const footballs = await Football.find();
    res.json(footballs);
  } catch (err) {
    console.error('Error fetching records:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// TASK 1.5: Add a record to the Football collection
app.post('/api/footballs', async (req, res) => {
  try {
    const newRecord = new Football(req.body);
    await newRecord.save();

    // console.log('Data successfully saved in MongoDB:', newRecord); // Log saved data
    res.status(201).json({ message: 'Record added successfully', newRecord });
  } catch (err) {
    console.error('Error adding record:', err.message, err.errors); // Log any errors
    res.status(500).json({ error: err.message, details: err.errors });
  }
});



// TASK 1.6: Update a record for a given team
app.post('/api/footballs/update', async (req, res) => {
  const { Team, Year, ...updateData } = req.body;

  try {
    console.log(`Update request received for Team: ${Team}, Year: ${Year}`);

    // Validate inputs
    if (!Team || !Year) {
      return res.status(400).json({ message: 'Team and Year are required.' });
    }

    const query = {
      Team: new RegExp(`^${Team}$`, 'i'), // Case-insensitive match
      Year: parseInt(Year, 10),
    };

    console.log('Query being executed:', query);

    // Check if the record exists
    const record = await Football.findOne(query);

    if (!record) {
      console.log(`No record found for Team: ${Team}, Year: ${Year}`);
      return res.status(404).json({ message: `No record found for Team: ${Team}.` });
    }

    // Proceed with the update
    const updatedRecord = await Football.findOneAndUpdate(query, updateData, { new: true });
    console.log('Record updated:', updatedRecord);
    res.json({ message: 'Record updated successfully', updatedRecord });
  } catch (err) {
    console.error('Error updating record:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// TASK 1.7: Get total games played, draw, and won for a given year
app.get('/api/footballs/summary/:year', async (req, res) => {
  const year = req.params.year;
  try {
    const summary = await Football.aggregate([
      { $match: { Year: parseInt(year) } },
      {
        $group: {
          _id: '$Year',
          totalGamesPlayed: { $sum: '$GamesPlayed' },
          totalWins: { $sum: '$Win' },
          totalDraws: { $sum: '$Draw' },
        },
      },
    ]);
    console.log(`Summary for year ${year}:`, summary);
    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// TASK 1.8: Delete a record for a given team
app.post('/api/footballs/delete', async (req, res) => {
  const { Team, Year } = req.body;

  try {
    console.log(`Delete request received for Team: ${Team}, Year: ${Year}`);

    if (!Team || !Year) {
      return res.status(400).json({ message: 'Team and Year are required.' });
    }

    const query = {
      Team: new RegExp(`^${Team}$`, 'i'), // Case-insensitive regex
      Year: parseInt(Year, 10),
    };

    console.log('Query being executed:', query);

    // Check if the record exists
    const record = await Football.findOne(query);

    if (!record) {
      console.log(`No record found for Team: ${Team}, Year: ${Year}`);
      return res.status(404).json({ message: `No record found for Team: ${Team}.` });
    }

    // Proceed to delete the record
    await Football.findOneAndDelete(query);
    console.log(`Record deleted for Team: ${Team}, Year: ${Year}`);
    res.json({ message: 'Record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting record:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// TASK 1.9 Display first 10 records with "Won" greater than a given value
app.get('/api/footballs/wins/:value', async (req, res) => {
  const value = parseInt(req.params.value);
  try {
    const results = await Football.find({ Win: { $gt: value } })
    .sort({ Win: -1 })
      .limit(10)
      .exec();
    console.log(`Records with wins greater than ${value}:`, results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching records with wins:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// TASK 2.0: GET Route to Fetch Records with Average Goals for a Given Year (by Team)
app.get('/api/footballs/average-goals/:year', async (req, res) => {
  const year = parseInt(req.params.year);
  try {
    const results = await Football.aggregate([
      { $match: { Year: year } }, // Match based on the provided year
      {
        $project: {
          Team: 1,
          GamesPlayed: 1,
          Win: 1,
          Draw: 1,
          Loss: 1,
          GoalsFor: 1,
          GoalsAgainst: 1,
          Points: 1,
          Year: 1,
          avgGoals: {
            $cond: {
              if: { $eq: ["$GamesPlayed", 0] },
              then: 0,
              else: { $divide: ["$GoalsFor", "$GamesPlayed"] }
            }
          } // Calculate average goals
        }
      },
      { $sort: { Team: 1 } } // Sort teams alphabetically by 'Team' field
    ]);

    console.log('Results with Average Goals by Team:', JSON.stringify(results, null, 2)); // Log the result in the console
    res.json(results);
  } catch (err) {
    console.error('Error fetching records:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get total games played, draw, and won for a given team 
// This task is for TASK 2.3 for Frontend
app.get('/api/footballs/team-summary/:team', async (req, res) => {
  const teamName = req.params.team;
  try {
    const summary = await Football.aggregate([
      { $match: { Team: { $regex: new RegExp(`^${teamName}$`, 'i') } } }, // Case-insensitive match
      {
        $group: {
          _id: '$Team',
          totalGamesPlayed: { $sum: '$GamesPlayed' },
          totalWins: { $sum: '$Win' },
          totalDraws: { $sum: '$Draw' },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary for team:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// GET Route to Fetch Unique Years 

app.get('/api/footballs/years', async (req, res) => {
  try {
    const years = await Football.distinct('Year'); // Get unique years
    res.json(years.sort((a, b) => b - a)); // Return years sorted in descending order
  } catch (err) {
    console.error('Error fetching years:', err.message);
    res.status(500).json({ error: 'Error fetching years. Please try again later.' });
  }
});
