// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/footballs';

export const getAllRecords = () => axios.get(`${API_URL}`);
export const addRecord = (data) => axios.post(`${API_URL}`, data);
export const updateRecord = (data) => axios.post(`${API_URL}/update`, data);
export const deleteRecord = (data) => axios.post(`${API_URL}/delete`, data);
export const getSummaryByYear = (year) => axios.get(`${API_URL}/summary/${year}`);
export const getRecordsByWins = (value) => axios.get(`${API_URL}/wins/${value}`);
export const getAverageGoals = (year) => axios.get(`${API_URL}/goals/${year}`);
