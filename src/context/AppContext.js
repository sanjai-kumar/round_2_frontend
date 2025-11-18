import React, { createContext, useContext, useState, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const response = await productService.getAll(filters);
      setProducts(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    categories,
    products,
    loading,
    fetchCategories,
    fetchProducts,
    setCategories,
    setProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};