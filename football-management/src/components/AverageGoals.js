import React, { useState, useEffect } from 'react';
import './AverageGoals.css';

const AverageGoals = () => {
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);
  const [teams, setTeams] = useState([]);
  const [flags, setFlags] = useState({});
  const [error, setError] = useState('');

  // Fetch all unique years from the database
  const fetchYears = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/footballs/years');
      const data = await response.json();
      setYears(data); // Set the years for the dropdown
    } catch (error) {
      console.error('Error fetching years:', error.message);
      setError('Error fetching years. Please try again later.');
    }
  };
  
  useEffect(() => {
    fetchYears(); // Fetch years when the component loads
  }, []);
  

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
    if (!year) {
      setError('Please select a year.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/footballs/average-goals/${year}`); 
      const data = await response.json();
      if (data.length === 0) {
        setError(`No teams found for the year ${year}.`);
        setTeams([]);
      } else {
        setError('');
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Error fetching data from the server. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Teams with Average Goals</h2>
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
            <div className="form-group mb-3">
              <label></label>
              <select
                className="form-control mt-3 text-white bg-secondary bg-gradiant"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Choose a year</option>
                {years.map((yr, index) => (
                  <option key={index} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
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
              <h4 className="text-center">Teams with Average Goals for {year}</h4>
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
                      <th>Average Goals</th>
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
                        <td>{team.avgGoals?.toFixed(2) || 'N/A'}</td>
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

export default AverageGoals;
