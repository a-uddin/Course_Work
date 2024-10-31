// src/components/Summary.js
import React, { useState } from 'react';
import axios from 'axios';

const Summary = () => {
  const [year, setYear] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/footballs/summary/${year}`);
      if (data.length === 0) {
        setError(`No data found for the year ${year}`);
        setSummary(null);
      } else {
        setSummary(data[0]);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Error fetching data from server. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Year Summary</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="form-group mb-3">
            <label>Enter Year</label>
            <input
              type="number"
              className="form-control"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-primary" onClick={fetchSummary}>
              Get Summary
            </button>
          </div>

          {error && <p className="text-danger mt-3 text-center">{error}</p>}

          {summary && (
            <div className="mt-4">
              <h4 className="text-center">Summary for {year}</h4>
              <ul className="list-group">
                <li className="list-group-item">Total Games Played: {summary.totalGamesPlayed}</li>
                <li className="list-group-item">Total Wins: {summary.totalWins}</li>
                <li className="list-group-item">Total Draws: {summary.totalDraws}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
