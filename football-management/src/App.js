// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AllRecord from './components/AllRecord';
import AddRecord from './components/AddRecord';
import UpdateRecord from './components/UpdateRecord';
import Summary from './components/Summary';
import DeleteRecord from './components/DeleteRecord';
import TopWinningTeams from './components/TopWinningTeams';
import AverageGoals from './components/AverageGoals';
import TeamSummary from './components/TeamSummary'; // Import the new Team Summary component

const App = () => {
  return (
    <Router>
      {/* Navbar Code Starts Here */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">Football Records</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">All Records</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-record">Add Data</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/update-record">Update Data</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/year-summary">Year Summary</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/delete-record">Delete Record</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/top-winning-teams">Top Winning Teams</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/average-goals">Average Goals</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/team-summary">Team Summary</Link> {/* New link for Team Summary */}
            </li>
          </ul>
        </div>
      </nav>
      {/* Navbar Code Ends Here */}

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AllRecord />} />
          <Route path="/add-record" element={<AddRecord />} />
          <Route path="/update-record" element={<UpdateRecord />} />
          <Route path="/year-summary" element={<Summary />} />
          <Route path="/delete-record" element={<DeleteRecord />} />
          <Route path="/top-winning-teams" element={<TopWinningTeams />} />
          <Route path="/average-goals" element={<AverageGoals />} />
          <Route path="/team-summary" element={<TeamSummary />} /> {/* New route for Team Summary */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
