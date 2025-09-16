import axios from 'axios';
//http://localhost:5000
//https://build-a-bite-o8hp.onrender.com/api
const axiosClient = axios.create({
  baseURL: 'https://build-a-bite-o8hp.onrender.com/api',
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
