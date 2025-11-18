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
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { useAppContext } from '../../context/AppContext';
import ProductForm from './ProductForm';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProductList = () => {
  const { products, categories, fetchProducts, fetchCategories, loading } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleAddProduct = () => {
    if (categories.length === 0) {
      toast.error(' Please create a category first before adding products!', {
        duration: 4000,
      });
      return;
    }
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    try {
      await productService.delete(deleteDialog.product.id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="600">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct} 
          sx={{
            backgroundImage: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          }}
        >
          Add Product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                 No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {categories.length === 0
                  ? 'Please create a category first'
                  : 'Create your first product to get started'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddProduct}  
              >
                Create Product
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 1,
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="primary"
                        fontWeight="700"
                        sx={{
                          backgroundImage: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        ${parseFloat(product.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={0.5} ml={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(product)}
                        sx={{
                          '&:hover': { bgcolor: 'primary.light', color: 'white' },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product)}
                        sx={{
                          '&:hover': { bgcolor: 'error.light', color: 'white' },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                    <Chip
                      label={product.category?.name || 'No Category'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={product.inStock ? <CheckCircle /> : <Cancel />}
                      label={product.inStock ? 'In Stock' : 'Out of Stock'}
                      size="small"
                      color={product.inStock ? 'success' : 'error'}
                      variant={product.inStock ? 'filled' : 'outlined'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
      />
    </Box>
  );
};

export default ProductList;
