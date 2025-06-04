import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './styles/theme';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import BlogLayout from './components/layout/BlogLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import UserProfilePage from './pages/UserProfilePage';
import MyBlogsPage from './pages/MyBlogsPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => {
    return darkMode ? darkTheme : lightTheme;
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Blog detail route */}
              <Route element={<BlogLayout />}>
                <Route path="/blogs/:id" element={<BlogDetailPage />} />
              </Route>

              {/* Main routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />

                {/* Protected routes */}
                <Route path="/blogs/create" element={<ProtectedRoute element={<CreateBlogPage />} />} />
                <Route path="/blogs/:id/edit" element={<ProtectedRoute element={<EditBlogPage />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<UserProfilePage />} />} />
                <Route path="/my-blogs" element={<ProtectedRoute element={<MyBlogsPage />} />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
  );
};

export default App;
