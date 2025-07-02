// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Change to ngrok URL when hosted
});

export default api;
