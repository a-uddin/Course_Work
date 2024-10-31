// src/components/UpdateRecord.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateRecord = () => {
  const [formData, setFormData] = useState({
    Team: '',
    Year: '',
    GamesPlayed: '',
    Win: '',
    Draw: '',
    Loss: '',
    GoalsFor: '',
    GoalsAgainst: '',
    Points: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'number' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/footballs/update', formData);
      alert('Record updated successfully!');
      setFormData({
        Team: '',
        Year: '',
        GamesPlayed: '',
        Win: '',
        Draw: '',
        Loss: '',
        GoalsFor: '',
        GoalsAgainst: '',
        Points: ''
      });
    } catch (err) {
      console.error('Error updating record:', err);
      alert('Error updating record. Please check the console for more details.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Update Football Record</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Team Name</label>
              <input
                type="text"
                name="Team"
                className="form-control"
                value={formData.Team}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Year</label>
              <input
                type="number"
                name="Year"
                className="form-control"
                value={formData.Year}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Games Played</label>
              <input
                type="number"
                name="GamesPlayed"
                className="form-control"
                value={formData.GamesPlayed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Wins</label>
              <input
                type="number"
                name="Win"
                className="form-control"
                value={formData.Win}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Draws</label>
              <input
                type="number"
                name="Draw"
                className="form-control"
                value={formData.Draw}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Losses</label>
              <input
                type="number"
                name="Loss"
                className="form-control"
                value={formData.Loss}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Goals For</label>
              <input
                type="number"
                name="GoalsFor"
                className="form-control"
                value={formData.GoalsFor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Goals Against</label>
              <input
                type="number"
                name="GoalsAgainst"
                className="form-control"
                value={formData.GoalsAgainst}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Points</label>
              <input
                type="number"
                name="Points"
                className="form-control"
                value={formData.Points}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Update Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRecord;
