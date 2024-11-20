// src/components/TeamSummary.js
import React, { useState } from 'react';
import axios from 'axios';

const TeamSummary = () => {
  const [team, setTeam] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async (e) => {
    if (e) e.preventDefault();
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
          <form onSubmit={fetchSummary}>
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
              <button type="submit" className="btn btn-primary">
                Get Summary
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && <p className="text-danger mt-3 text-center">{error}</p>}

      {summary && (
        <div className="mt-4 d-flex justify-content-center">
          <div className="table-responsive" style={{ maxWidth: '600px' }}>
            <h4 className="text-center mb-4">Summary for {summary._id}</h4>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">Total Games Played</th>
                  <th className="text-center">Total Wins</th>
                  <th className="text-center">Total Draws</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">{summary.totalGamesPlayed}</td>
                  <td className="text-center">{summary.totalWins}</td>
                  <td className="text-center">{summary.totalDraws}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSummary;
