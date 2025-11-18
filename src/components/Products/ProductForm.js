import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
} from '@mui/material';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { useAppContext } from '../../context/AppContext';

const ProductForm = ({ open, onClose, product, onSuccess }) => {
  const { categories, fetchCategories } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    inStock: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
      });
      setErrors({});
    } else if (open && !product) {
      setFormData({ name: '', price: '', categoryId: '', inStock: true });
      setErrors({});
    }
  }, [product, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required (must be greater than 0)';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
      };

      if (product) {
        await productService.update(product.id, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.create(payload);
        toast.success('Product created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {product ? ' Edit Product' : ' Create New Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            {categories.length === 0 && (
              <Alert severity="warning">
                 No categories available. Please create a category first.
              </Alert>
            )}

            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              placeholder="e.g., Laptop, T-Shirt, Coffee"
              error={!!errors.name}
              helperText={errors.name}
              size="small"
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: '0.01' }}
              placeholder="0.00"
              error={!!errors.price}
              helperText={errors.price}
              size="small"
            />

            <FormControl
              fullWidth
              required
              size="small"
              error={!!errors.categoryId}
              disabled={categories.length === 0}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>No categories available</em>
                  </MenuItem>
                )}
              </Select>
              {errors.categoryId && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                  {errors.categoryId}
                </Typography>
              )}
            </FormControl>

            {product && product.category && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#e3f2fd',
                  borderRadius: 1,
                  border: '1px solid #90caf9',
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  Current Category: {product.category?.name || 'Not set'}
                </Typography>
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={formData.inStock ? ' In Stock' : ' Out of Stock'}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={submitting} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || categories.length === 0}
            sx={{
              backgroundImage: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
            }}
          >
            {submitting ? ' Saving...' : product ? ' Update' : ' Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
