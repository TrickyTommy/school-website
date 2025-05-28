import axios from 'axios';

const BASE_URL = 'http://localhost/sekolah/api';

export const API_ENDPOINTS = {
    postingan: `${BASE_URL}/postingan.php`,
    guruStaff: `${BASE_URL}/guru_staff.php`,
    jurusan: `${BASE_URL}/jurusan.php`  // Add this line
};

// Add simple cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
        try {
            // Check cache first
            const cacheKey = 'guruStaff_all';
            const cachedData = cache.get(cacheKey);
            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
                return cachedData.data;
            }

            const response = await fetch(API_ENDPOINTS.guruStaff);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Store in cache
            cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            if (!data.email) {
                delete data.email;
            }
            
            // Handle large images
            if (data.image && data.image.length > 2000000) { // If larger than ~2MB
                const compressedImage = await this.compressImage(data.image);
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
    },

    // Simple image compression helper
    compressImage: async (base64String) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Target max dimension
                const maxDim = 800;
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxDim) {
                        height = Math.round(height * maxDim / width);
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width = Math.round(width * maxDim / height);
                        height = maxDim;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = base64String;
        });
    },
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
