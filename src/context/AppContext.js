import React, { createContext, useState, useContext, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      console.log(' Fetching categories from:', process.env.REACT_APP_API_BASE_URL);

      const response = await categoryService.getAll();
      console.log(' Categories response:', response);

      setCategories(response.data || []);
    } catch (error) {
      console.error(' Error fetching categories:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
      });

      setError(error.message);
      setCategories([]);

      if (error.response?.status !== 404) {
        toast.error('Failed to load categories. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading]); 

  const fetchProducts = useCallback(async (filters = {}) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      console.log(' Fetching products with filters:', filters);

      const response = await productService.getAll(filters);
      console.log(' Products response:', response);

      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
      });

      setError(error.message);
      setProducts([]);

      if (error.response?.status !== 404) {
        toast.error('Failed to load products. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);
  const value = {
    categories,
    setCategories,
    products,
    setProducts,
    loading,
    setLoading,
    error,
    setError,
    fetchCategories,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
