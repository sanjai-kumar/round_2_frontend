import React, { createContext, useState, useContext, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
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
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    categories,
    setCategories,
    products,
    setProducts,
    loading,
    setLoading,
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
