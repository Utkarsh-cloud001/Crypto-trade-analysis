export const getBaseURL = () => {
    // If explicit API URL is set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Production fallback for known Render deployment
    // This fixes the issue where VITE_API_URL might be missing in Netlify dashboard
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://crypto-trade-analysis-server.onrender.com';
    }

    // Default local fallback
    return 'http://localhost:5000';
};
