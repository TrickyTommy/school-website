import axios from 'axios';

const API_URL = 'http://localhost/sekolah/api';

export const postinganAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/postingan.php`);
    return response.json();
  },

  create: async (postData) => {
    const response = await fetch(`${API_URL}/postingan.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  update: async (postData) => {
    const response = await fetch(`${API_URL}/postingan.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/postingan.php?id=${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
