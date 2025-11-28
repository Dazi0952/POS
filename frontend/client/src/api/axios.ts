import axios from 'axios';
                     
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('pos_tenant_id');
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  const token = localStorage.getItem('pos_token');
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;