// src/components/AllRecords.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllRecord = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  // Fetch all records from the server when the component loads
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/footballs');
        setRecords(response.data);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError('Error fetching data from server. Please try again later.');
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Football Records</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
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
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.Team}</td>
                <td>{record.GamesPlayed}</td>
                <td>{record.Win}</td>
                <td>{record.Draw}</td>
                <td>{record.Loss}</td>
                <td>{record.GoalsFor}</td>
                <td>{record.GoalsAgainst}</td>
                <td>{record.Points}</td>
                <td>{record.Year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRecord;
