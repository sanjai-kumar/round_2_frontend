import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';

const CategoryForm = ({ open, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
      setErrors({});
    } else {
      setFormData({ name: '', description: '' });
      setErrors({});
    }
  }, [category, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      if (category) {
        await categoryService.update(category.id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(formData);
        toast.success('Category created successfully');
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
        {category ? ' Edit Category' : ' Create New Category'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              placeholder="e.g., Electronics, Clothing, Food"
              error={!!errors.name}
              helperText={errors.name}
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              placeholder="Add a description for this category (optional)"
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/500`}
              size="small"
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
            disabled={submitting}
            sx={{
              backgroundImage: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
            }}
          >
            {submitting ? ' Saving...' : category ? ' Update' : ' Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;