const API_BASE_URL = 'http://localhost:8080/api';

// Utility function để gọi API
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Thêm token nếu có
    const token = localStorage.getItem('accessToken');
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Các method HTTP
export const api = {
    get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiCall(endpoint, { 
        method: 'POST', 
        body: JSON.stringify(data) 
    }),
    put: (endpoint, data) => apiCall(endpoint, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
    }),
    delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};
