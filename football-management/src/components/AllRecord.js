// src/components/AllRecord.js
import React, { useEffect, useState } from 'react';


const AllRecord = () => {
  const [records, setRecords] = useState([]);
  const [flags, setFlags] = useState({});

  // Fetch all football records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/footballs'); 
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.Team.localeCompare(b.Team)); // Sort records alphabetically by team name
        setRecords(sortedData);
      } catch (error) {
        console.error('Error fetching football records:', error);
      }
    };

    fetchRecords();
  }, []);

  // Fetch country flags
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

  return (
    <div>
      <h2 className="text-center">All Football Records</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th></th>
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
                <td>
                  {flags[record.Team] ? (
                    <img
                      src={flags[record.Team]}
                      alt={record.Team}
                      style={{ width: '40px', height: '25px' }}
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
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
