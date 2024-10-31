// src/components/AverageGoals.js
import React, { useState } from 'react';
import axios from 'axios';

const AverageGoals = () => {
  const [year, setYear] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`http://localhost:5000/api/footballs/average-goals/${year}`);
      console.log('Fetched Data with Average Goals:', data);
      if (data.length === 0) {
        setError(`No teams found for the year ${year}`);
        setTeams([]);
      } else {
        setTeams(data);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Error fetching data from server. Please try again later.');
      setTeams([]);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Teams for Year {year}</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
            <div className="form-group mb-3">
              <label>Enter Year</label>
              <input
                type="number"
                className="form-control"
                placeholder="Year"
                value={year}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Get Teams
              </button>
            </div>
          </form>

          {error && <p className="text-danger mt-3 text-center">{error}</p>}

          {teams.length > 0 && (
            <div className="mt-4">
              <h4 className="text-center">Teams with Average Goals for Year {year}</h4>
              <div className="table-responsive">
                <table className="table table-striped table-bordered" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead className="thead-dark">
                    <tr>
                      <th>Team</th>
                      <th>Games Played</th>
                      <th>Win</th>
                      <th>Draw</th>
                      <th>Loss</th>
                      <th>Goals For</th>
                      <th>Goals Against</th>
                      <th>Points</th>
                      <th>Year</th>
                      <th>Average Goals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={index}>
                        <td>{team.Team}</td>
                        <td>{team.GamesPlayed}</td>
                        <td>{team.Win}</td>
                        <td>{team.Draw}</td>
                        <td>{team.Loss}</td>
                        <td>{team.GoalsFor}</td>
                        <td>{team.GoalsAgainst}</td>
                        <td>{team.Points}</td>
                        <td>{team.Year}</td>
                        <td>{team.avgGoals !== undefined ? team.avgGoals.toFixed(2) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AverageGoals;
