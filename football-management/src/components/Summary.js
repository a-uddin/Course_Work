import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Summary = () => {
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]); // State for available years
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  // Fetch years when the component mounts
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/footballs/years');
        setYears(data); // Populate years state
      } catch (err) {
        console.error('Error fetching years:', err);
        setError('Error fetching years. Please try again later.');
      }
    };

    fetchYears();
  }, []);

  const fetchSummary = async (e) => {
    if (e) e.preventDefault();
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
      setSummary(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Year Summary</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <form onSubmit={fetchSummary}>
            <div className="form-group mb-3">
            <label></label>
              <select
                className="form-control text-white bg-secondary bg-gradiant"
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
                Get Summary
              </button>
            </div>
          </form>

          {error && <p className="text-danger mt-3 text-center">{error}</p>}

          {summary && (
            <div className="mt-4">
              <h4 className="text-center">Summary for {summary._id}</h4>
              <div className="table-responsive">
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
      </div>
    </div>
  );
};

export default Summary;
