import axios from 'axios';

const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

export const fetchMandiPrices = async (filters = {}, limit = 10, offset = 0) => {
    try {
        const params = {
            'api-key': API_KEY,
            format: 'json',
            limit,
            offset, // ✅ always defined
            ...Object.keys(filters).reduce((acc, key) => {
                acc[`filters[${key}]`] = filters[key];
                return acc;
            }, {})
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching mandi prices:", error);
        throw error;
    }
};
