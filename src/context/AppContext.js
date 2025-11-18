import React, { createContext, useState, useContext, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Use useCallback to memoize fetchCategories
  // This ensures the function reference doesn't change on every render
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
  }, []); // ✅ Empty dependency array - function never changes

  // ✅ FIX: Use useCallback for fetchProducts too
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
  }, []); // ✅ Empty dependency array - function never changes

  const value = {
    categories,
    setCategories,
    products,
    setProducts,
    loading,
    setLoading,
    fetchCategories, // ✅ Now memoized - stable reference
    fetchProducts,   // ✅ Now memoized - stable reference
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
