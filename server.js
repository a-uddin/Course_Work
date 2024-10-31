// server.js
const express = require('express');
const cors = require('cors'); // Import CORS
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

// Add a record to the Football collection
app.post('/api/footballs', async (req, res) => {
  try {
    console.log('Received data from frontend:', req.body); // Log received data
    
    const newRecord = new Football(req.body);
    await newRecord.save();

    console.log('Data successfully saved in MongoDB:', newRecord); // Log saved data
    res.status(201).json({ message: 'Record added successfully', newRecord });
  } catch (err) {
    console.error('Error adding record:', err.message, err.errors); // Log any errors
    res.status(500).json({ error: err.message, details: err.errors });
  }
});



// Update a record for a given team
app.post('/api/footballs/update', async (req, res) => {
  const { Team, Year, ...updateData } = req.body;
  try {
    const updatedRecord = await Football.findOneAndUpdate(
      { Team, Year },
      updateData,
      { new: true }
    );
    console.log('Record updated:', updatedRecord);
    res.json({ message: 'Record updated successfully', updatedRecord });
  } catch (err) {
    console.error('Error updating record:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get total games played, draw, and won for a given year
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


// Get total games played, draw, and won for a given team 
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




// Delete a record for a given team
app.post('/api/footballs/delete', async (req, res) => {
  const { Team, Year } = req.body;
  try {
    await Football.findOneAndDelete({ Team, Year });
    console.log(`Record deleted for team: ${Team}, Year: ${Year}`);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Display first 10 records with "Won" greater than a given value
app.get('/api/footballs/wins/:value', async (req, res) => {
  const value = parseInt(req.params.value);
  try {
    const results = await Football.find({ Win: { $gt: value } })
      .limit(10)
      .exec();
    console.log(`Records with wins greater than ${value}:`, results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching records with wins:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Display all teams with average "Goals For" greater than a given value
app.get('/api/footballs/goals/:year', async (req, res) => {
  const year = parseInt(req.params.year);
  try {
    const results = await Football.aggregate([
      { $match: { Year: year } },
      {
        $group: {
          _id: '$Team',
          avgGoals: { $avg: '$GoalsFor' },
        },
      },
      { $match: { avgGoals: { $gt: 0 } } },
    ]);
    console.log(`Teams with average "Goals For" for the year ${year}:`, results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching teams with average goals:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Get total games played, draw, and won for a given team
app.get('/api/footballs/summary/team/:teamName', async (req, res) => {
  const teamName = req.params.teamName;
  try {
    // Find the document for the given team name (case-insensitive)
    const summary = await Football.findOne({ Team: new RegExp(`^${teamName}$`, 'i') }, {
      Team: 1,
      GamesPlayed: 1,
      Win: 1,
      Draw: 1,
      _id: 0, // Exclude the default MongoDB _id field
    });

    if (summary) {
      console.log(`Summary for team ${teamName}:`, summary);
      res.json(summary);
    } else {
      res.status(404).json({ message: `No data found for team ${teamName}` });
    }
  } catch (err) {
    console.error('Error fetching summary for team:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// GET Route to Fetch Records with Average Goals for a Given Year (by Team)
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
