import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:5000/api';

// Items API
export const itemsApi = {
  // Fetch all items
  fetchItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },
  
  // Add more item-related API calls as needed
  // e.g., fetchItemById, createItem, updateItem, deleteItem
};

// Export other API services as needed
// export const usersApi = { ... }