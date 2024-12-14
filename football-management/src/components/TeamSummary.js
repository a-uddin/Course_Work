import React, { useState, useEffect } from "react";
import axios from "axios";

const TeamSummary = () => {
  const [team, setTeam] = useState("");
  const [records, setRecords] = useState([]); // To store all records for matching teams
  const [teams, setTeams] = useState([]); // To store all team names
  const [filteredTeams, setFilteredTeams] = useState([]); // For suggestions
  const [flags, setFlags] = useState({}); // To store flags for each country

  // Fetch all team names and records when the component mounts
  useEffect(() => {
    const fetchTeamsAndRecords = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/footballs");
        const teamNames = [...new Set(data.map((record) => record.Team))]; // Extract unique team names
        setTeams(teamNames);
        setRecords(data);

        // Fetch flags
        const flagResponse = await axios.get("https://restcountries.com/v3.1/all");
        const flagsMap = {};
        flagResponse.data.forEach((country) => {
          flagsMap[country.name.common] = country.flags.svg; // Map country names to flag URLs
        });
        setFlags(flagsMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchTeamsAndRecords();
  }, []);

  // Handle team input change and filter suggestions
  const handleTeamInput = (value) => {
    setTeam(value);

    if (value.trim() === "") {
      setFilteredTeams([]);
      return;
    }

    const suggestions = teams.filter((t) =>
      t.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredTeams(suggestions);
  };

  // Filter records for matching teams
  const getMatchingRecords = () => {
    if (!team.trim()) return [];
    return records.filter((record) =>
      record.Team.toLowerCase().includes(team.toLowerCase())
    );
  };

  // Calculate totals for matching records
  const calculateTotals = (data) => {
    const totals = {
      GamesPlayed: 0,
      Win: 0,
      Draw: 0,
      Loss: 0,
      GoalsFor: 0,
      GoalsAgainst: 0,
    };

    data.forEach((record) => {
      totals.GamesPlayed += record.GamesPlayed;
      totals.Win += record.Win;
      totals.Draw += record.Draw;
      totals.Loss += record.Loss;
      totals.GoalsFor += record.GoalsFor;
      totals.GoalsAgainst += record.GoalsAgainst;
    });

    return totals;
  };

  const matchingRecords = getMatchingRecords();
  const totals = calculateTotals(matchingRecords);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Team Summary</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a Team Name"
              value={team}
              onChange={(e) => handleTeamInput(e.target.value)}
            />
            {/* Suggestions Dropdown */}
            {filteredTeams.length > 0 && (
              <ul className="list-group mt-2">
                {filteredTeams.map((suggestion, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => {
                      setTeam(suggestion);
                      setFilteredTeams([]); // Clear suggestions on selection
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Matching Teams Table */}
      {matchingRecords.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center mb-3">Matching Teams</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Flag</th>
                  <th>Team</th>
                  <th>Games Played</th>
                  <th>Win</th>
                  <th>Draw</th>
                  <th>Loss</th>
                  <th>Goals For</th>
                  <th>Goals Against</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {matchingRecords.map((record, index) => (
                  <tr key={index}>
                    <td>
                      {flags[record.Team] ? (
                        <img
                          src={flags[record.Team]}
                          alt={record.Team}
                          style={{ width: "40px", height: "25px" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{record.Team}</td>
                    <td>{record.GamesPlayed}</td>
                    <td>{record.Win}</td>
                    <td>{record.Draw}</td>
                    <td>{record.Loss}</td>
                    <td>{record.GoalsFor}</td>
                    <td>{record.GoalsAgainst}</td>
                    <td>{record.Year}</td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="table-info">
                  <td><strong>&mdash;</strong></td>
                  <td><strong>Total</strong></td>
                  <td><strong>{totals.GamesPlayed}</strong></td>
                  <td><strong>{totals.Win}</strong></td>
                  <td><strong>{totals.Draw}</strong></td>
                  <td><strong>{totals.Loss}</strong></td>
                  <td><strong>{totals.GoalsFor}</strong></td>
                  <td><strong>{totals.GoalsAgainst}</strong></td>
                  <td><strong>&mdash;</strong></td>
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
