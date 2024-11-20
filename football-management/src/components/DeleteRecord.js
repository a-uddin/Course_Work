// src/components/DeleteRecord.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteRecord = () => {
  const [formData, setFormData] = useState({
    Team: '',
    Year: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/footballs/delete', formData);
      setMessage(response.data.message);
      setError('');
      setFormData({ Team: '', Year: '' }); // Reset form
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Error deleting record. Please check the console for more details.');
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Delete Football Record</h2>
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
            <div className="d-grid">
              <button type="submit" className="btn btn-danger">
                Delete Record
              </button>
            </div>
          </form>

          {error && <p className="text-danger mt-3 text-center">{error}</p>}
          {message && <p className="text-success mt-3 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeleteRecord;
