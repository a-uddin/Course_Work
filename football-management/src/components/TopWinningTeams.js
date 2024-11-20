// src/components/TopWinningTeams.js
import React, { useState, useEffect } from 'react';
import './TopWinningTeams.css';


const TopWinningTeams = () => {
  const [wins, setWins] = useState('');
  const [teams, setTeams] = useState([]);
  const [flags, setFlags] = useState({});
  const [error, setError] = useState('');

  // Fetch country flags dynamically
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        const flagsMap = {};
        countries.forEach((country) => {
          flagsMap[country.name.common] = country.flags.svg; // Map country names to flag URLs
        });
        setFlags(flagsMap);
      } catch (error) {
        console.error('Error fetching flags:', error);
      }
    };

    fetchFlags();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wins) {
      setError('Please enter the minimum wins.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/footballs/wins/${wins}`); 
      const data = await response.json();
      if (data.length === 0) {
        setError(`No teams found with wins greater than ${wins}.`);
        setTeams([]);
      } else {
        setError('');
        const sortedData = data.sort((a, b) => a.Team.localeCompare(b.Team)); // Sort teams alphabetically by team name
        setTeams(sortedData);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Error fetching data from the server. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Teams with Wins Greater Than {wins}</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
            <div className="form-group mb-3">
              <label>Enter Minimum Wins</label>
              <input
                type="number"
                className="form-control"
                placeholder="Wins"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
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
              <h4 className="text-center">Teams with Wins Greater Than {wins}</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th></th>
                      <th>Team</th>
                      <th>Games Played</th>
                      <th>Wins</th>
                      <th>Draws</th>
                      <th>Losses</th>
                      <th>Goals For</th>
                      <th>Goals Against</th>
                      <th>Points</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={index}>
                        <td>
                          {flags[team.Team] ? (
                            
                            <img
                              src={flags[team.Team]}
                              alt={team.Team}
                              className="flag"
                              style={{ width: '40px', height: '25px' }}
                            />
                          
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{team.Team}</td>
                        <td>{team.GamesPlayed}</td>
                        <td>{team.Win}</td>
                        <td>{team.Draw}</td>
                        <td>{team.Loss}</td>
                        <td>{team.GoalsFor}</td>
                        <td>{team.GoalsAgainst}</td>
                        <td>{team.Points}</td>
                        <td>{team.Year}</td>
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

export default TopWinningTeams;
