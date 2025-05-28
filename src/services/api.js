import axios from 'axios';

const BASE_URL = 'http://localhost/sekolah/api';
// const BASE_URL = 'https://floralwhite-wildcat-164447.hostingersite.com/';

export const API_ENDPOINTS = {
    postingan: `${BASE_URL}/postingan.php`,
    guruStaff: `${BASE_URL}/guru_staff.php`,
    jurusan: `${BASE_URL}/jurusan.php`,
    principals: `${BASE_URL}/principals.php`
};

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Request debouncing
const debounceRequests = new Map();
const DEBOUNCE_DELAY = 300;

// Utility to debounce requests
const debounce = (key, fn) => {
  if (debounceRequests.has(key)) {
    clearTimeout(debounceRequests.get(key));
  }
  
  return new Promise((resolve) => {
    const timeout = setTimeout(async () => {
      debounceRequests.delete(key);
      resolve(await fn());
    }, DEBOUNCE_DELAY);
    
    debounceRequests.set(key, timeout);
  });
};

// Enhanced image compression
const compressImage = async (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round(height * maxWidth / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64String;
  });
};

// Cache management 
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const postinganAPI = {
    getAll: async () => {
        try {
            const response = await fetch(API_ENDPOINTS.postingan);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    create: async (postData) => {
        try {
            const response = await fetch(API_ENDPOINTS.postingan, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    update: async (postData) => {
        try {
            const response = await fetch(API_ENDPOINTS.postingan, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.postingan}?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
};

export const guruStaffAPI = {
    getAll: async () => {
        const cacheKey = 'guruStaff_all';
        const cached = getCachedData(cacheKey);
        if (cached) return cached;

        return debounce(cacheKey, async () => {
            try {
                const response = await fetch(API_ENDPOINTS.guruStaff);
                const data = await response.json();
                cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                return data;
            } catch (error) {
                console.error('Fetch Error:', error);
                throw error;
            }
        });
    },

    create: async (data) => {
        try {
            if (!data.email) {
                delete data.email;
            }
            
            // Handle large images
            if (data.image && data.image.length > 2000000) { // If larger than ~2MB
                const compressedImage = await compressImage(data.image);
                data.image = compressedImage;
            }

            const response = await fetch(API_ENDPOINTS.guruStaff, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            // Clear cache on successful creation
            cache.delete('guruStaff_all');
            
            return response.json();
        } catch (error) {
            console.error('Create Error:', error);
            throw error;
        }
    },

    update: async (data) => {
        try {
            if (!data.email) {
                delete data.email;
            }

            const response = await fetch(API_ENDPOINTS.guruStaff, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.json();
        } catch (error) {
            console.error('Update Error:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.guruStaff}?id=${id}`, {
                method: 'DELETE'
            });
            return response.json();
        } catch (error) {
            console.error('Delete Error:', error);
            throw error;
        }
    }
};

export const jurusanAPI = {
    getAll: async () => {
        try {
            const response = await fetch(API_ENDPOINTS.jurusan);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await fetch(API_ENDPOINTS.jurusan, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    update: async (data) => {
        try {
            const response = await fetch(API_ENDPOINTS.jurusan, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.jurusan}?id=${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export const principalsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.principals);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      throw new Error('Failed to fetch principals: ' + error.message);
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(API_ENDPOINTS.principals, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      throw new Error('Failed to create principal: ' + error.message);
    }
  },

  update: async (data) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.principals}/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      throw new Error('Failed to update principal: ' + error.message);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.principals}/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      throw new Error('Failed to delete principal: ' + error.message);
    }
  }
};