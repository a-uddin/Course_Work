import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AllRecord = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [flags, setFlags] = useState({});
  const [totalRow, setTotalRow] = useState({
    GamesPlayed: 0,
    Win: 0,
    Draw: 0,
    Loss: 0,
    GoalsFor: 0,
    GoalsAgainst: 0,
  });

  const location = useLocation();

  // Fetch all football records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/footballs");
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.Team.localeCompare(b.Team));
        setRecords(sortedData);
        setFilteredRecords(sortedData);

        const uniqueYears = [...new Set(data.map((record) => record.Year))];
        setYears(uniqueYears.sort((a, b) => b - a));
      } catch (error) {
        console.error("Error fetching football records:", error);
      }
    };

    fetchRecords();
  }, []);

  // Fetch country flags
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const flagsMap = {};
        countries.forEach((country) => {
          flagsMap[country.name.common] = country.flags.svg;
        });
        setFlags(flagsMap);
      } catch (error) {
        console.error("Error fetching flags:", error);
      }
    };

    fetchFlags();
  }, []);

  // Reset records when navigating back to the "All Records" page
  useEffect(() => {
    setFilteredRecords(records);
    setTeamSearch("");
    setSelectedYear("");
  }, [location, records]);

  // Calculate totals dynamically
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

    setTotalRow(totals);
  };

  // Handle search by team with dynamic filtering
  const handleSearch = (value) => {
    setTeamSearch(value);
    setSelectedYear(""); // Clear the Filter by Year search input when search by Team

    if (value.trim() === "") {
      setFilteredRecords(records);
      return;
    }

    const searchResults = records.filter((record) =>
      record.Team.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRecords(searchResults);
    calculateTotals(searchResults);
  };

  // Handle filter by year
  const handleYearFilter = (year) => {
    setSelectedYear(year);
    setTeamSearch(""); // Clear the team search input when filtering by year

    if (year === "") {
      setFilteredRecords(records);
      return;
    }

    const filteredByYear = records.filter((record) => record.Year === parseInt(year, 10));
    setFilteredRecords(filteredByYear);
  };

  return (
    <div>
      <h2 className="text-center">All Football Records</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search by Team */}
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Team"
            value={teamSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filter by Year */}
        <div>
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={selectedYear}
            onChange={(e) => handleYearFilter(e.target.value)}
          >
            <option value="">Filter by Year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
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
                  <td>{record.Points}</td>
                  <td>{record.Year}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No records found
                </td>
              </tr>
            )}
            {/* Total Row */}
            {filteredRecords.length > 0 && teamSearch.trim() !== "" && (
              <tr className="table-info">
                <td><strong>&mdash;</strong></td>
                <td><strong>Total</strong></td>
                <td><strong>{totalRow.GamesPlayed}</strong></td>
                <td><strong>{totalRow.Win}</strong></td>
                <td><strong>{totalRow.Draw}</strong></td>
                <td><strong>{totalRow.Loss}</strong></td>
                <td><strong>{totalRow.GoalsFor}</strong></td>
                <td><strong>{totalRow.GoalsAgainst}</strong></td>
                <td><strong>&mdash;</strong></td>
                <td><strong>&mdash;</strong></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRecord;
