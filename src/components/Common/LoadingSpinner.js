import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      gap={2}
    >
      <CircularProgress size={50} />
      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;