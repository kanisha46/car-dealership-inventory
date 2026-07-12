import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';
import EditVehicle from './Pages/EditVehicle';
import AddVehicle from './Pages/AddVehicle';
import NotFound from './Pages/NotFound';

import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#faf7f2',
              color: '#1a1612',
              border: '1px solid rgba(139,120,96,0.25)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(100,70,30,0.15)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
            },
          }}
        />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/vehicles/add"
              element={
                <AdminRoute>
                  <AddVehicle />
                </AdminRoute>
              }
            />
            <Route
              path="/vehicles/edit/:id"
              element={
                <AdminRoute>
                  <EditVehicle />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;