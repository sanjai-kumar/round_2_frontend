import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import { useAppContext } from '../../context/AppContext';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';

const CategoryList = () => {
  const { categories, fetchCategories, loading } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = async () => {
    try {
      await categoryService.delete(deleteDialog.category.id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleteDialog({ open: false, category: null });
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="600">
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
          sx={{
            backgroundImage: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          }}
        >
          Add Category
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📭 No categories found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Create your first category to get started
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setFormOpen(true)}
              >
                Create Category
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Box display="flex" gap={0.5} ml={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        sx={{
                          '&:hover': { bgcolor: 'primary.light', color: 'white' },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category)}
                        sx={{
                          '&:hover': { bgcolor: 'error.light', color: 'white' },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: '40px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {category.description || '📝 No description provided'}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={`ID: ${category.id}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CategoryForm
        open={formOpen}
        onClose={handleFormClose}
        category={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, category: null })}
      />
    </Box>
  );
};

export default CategoryList;