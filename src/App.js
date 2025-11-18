import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from './context/AppContext';
import ProductList from './components/Products/ProductList';
import CategoryList from './components/Categories/CategoryList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
             Product Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="PRODUCTS" />
            <Tab label="CATEGORIES" />
          </Tabs>
        </Box>

        {currentTab === 0 && <ProductList />}
        {currentTab === 1 && <CategoryList />}
      </Container>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContextProvider>
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AppContextProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
