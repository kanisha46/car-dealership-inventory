import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../Pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';

// Mock the services
vi.mock('../services/vehicleService', () => ({
  vehicleService: {
    getAllVehicles: vi.fn(),
    searchVehicles: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isAdmin: false, isAuthenticated: true }),
}));

const mockVehicles = [
  { id: 1, brand: 'Tesla', model: 'Model 3', category: 'Sedan', year: 2023, price: 39990.00, quantity: 12 },
  { id: 2, brand: 'Ford', model: 'Mustang Mach-E', category: 'SUV', year: 2022, price: 45990.00, quantity: 4 },
];

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons on mount', () => {
    vehicleService.getAllVehicles.mockReturnValue(new Promise(() => {})); // Never resolves to keep loading state

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Loading spinner text
    expect(screen.getByText(/Loading vehicles.../i)).toBeInTheDocument();
  });

  it('renders stats and vehicles lists upon successful fetch', async () => {
    vehicleService.getAllVehicles.mockResolvedValue(mockVehicles);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check stats cards are updated
      expect(screen.getByText('16')).toBeInTheDocument(); // total quantity = 12 + 4
      expect(screen.getByText('2')).toBeInTheDocument(); // category count = 2
      // Check card display
      expect(screen.getByText('Model 3')).toBeInTheDocument();
      expect(screen.getByText('Mustang Mach-E')).toBeInTheDocument();
    });
  });

  it('shows empty showroom display when no vehicles exist', async () => {
    vehicleService.getAllVehicles.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No Vehicles Found')).toBeInTheDocument();
    });
  });
});
