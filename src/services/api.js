import axios from 'axios';

const BASE_URL = 'http://localhost/sekolah/api';
// const BASE_URL = 'https://floralwhite-wildcat-164447.hostingersite.com/';

export const API_ENDPOINTS = {
    postingan: `${BASE_URL}/postingan.php`,
    guruStaff: `${BASE_URL}/guru_staff.php`
};

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

export const guruStaffAPI = {
    getAll: async () => {
        try {
            const response = await fetch(API_ENDPOINTS.guruStaff);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    create: async (data) => {
        // If email is empty string or null, remove it from the request
        if (!data.email) {
            delete data.email;
        }
        const response = await fetch(API_ENDPOINTS.guruStaff, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    update: async (data) => {
        // If email is empty string or null, remove it from the request
        if (!data.email) {
            delete data.email;
        }
        const response = await fetch(API_ENDPOINTS.guruStaff, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_ENDPOINTS.guruStaff}?id=${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};