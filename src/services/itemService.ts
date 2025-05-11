
import axios from 'axios';
import { toast } from "@/components/ui/sonner";
import authService from './authService';

export const fetchItems = async () => {
  try {
    // Get the token if user is authenticated
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get('/api/items', { headers });
    // Ensure we're returning an array even if the response is empty or invalid
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching items:', error);
    toast.error('Failed to fetch items');
    // Return an empty array on error
    return [];
  }
};

export const fetchItemById = async (id) => {
  try {
    const response = await axios.get(`/api/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    toast.error('Failed to fetch item');
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast.error('You must be logged in to create items');
      throw new Error('Authentication required');
    }
    
    const response = await axios.post('/api/items', itemData);
    toast.success('Item created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating item:', error);
    toast.error('Failed to create item');
    throw error;
  }
};

export const updateItem = async (id, itemData) => {
  try {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast.error('You must be logged in to update items');
      throw new Error('Authentication required');
    }
    
    const response = await axios.put(`/api/items/${id}`, itemData);
    toast.success('Item updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    toast.error('Failed to update item');
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast.error('You must be logged in to delete items');
      throw new Error('Authentication required');
    }
    
    await axios.delete(`/api/items/${id}`);
    toast.success('Item deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    toast.error('Failed to delete item');
    throw error;
  }
};
