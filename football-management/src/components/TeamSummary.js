// src/components/TeamSummary.js
import React, { useState } from 'react';
import axios from 'axios';

const TeamSummary = () => {
  const [team, setTeam] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/footballs/team-summary/${team}`);
      if (data.length === 0) {
        setError(`No data found for team: ${team}`);
        setSummary(null);
      } else {
        setSummary(data[0]);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching team summary:', err);
      setError('Error fetching data from server.');
      setSummary(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Team Summary</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="form-group mb-3">
            <label>Enter Team Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button onClick={fetchSummary} className="btn btn-primary">
              Get Summary
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-danger mt-3 text-center">{error}</p>}

      {summary && (
        <div className="mt-4">
          <h4 className="text-center">Summary for {summary._id}</h4>
          <p className="text-center">Total Games Played: {summary.totalGamesPlayed}</p>
          <p className="text-center">Total Wins: {summary.totalWins}</p>
          <p className="text-center">Total Draws: {summary.totalDraws}</p>
        </div>
      )}
    </div>
  );
};

export default TeamSummary;
