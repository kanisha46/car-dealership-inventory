import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import VehicalCard from '../components/VehicalCard';
import { useAuth } from '../context/AuthContext';

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockVehicle = {
  id: 1,
  brand: 'Tesla',
  model: 'Model Y',
  category: 'SUV',
  year: 2023,
  price: 49990.00,
  quantity: 5,
};

describe('VehicalCard Component', () => {
  it('renders vehicle information correctly', () => {
    useAuth.mockReturnValue({ isAdmin: false });

    render(
      <MemoryRouter>
        <VehicalCard
          vehicle={mockVehicle}
          onPurchase={vi.fn()}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('Model Y')).toBeInTheDocument();
    expect(screen.getByText('SUV')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('₹49,990')).toBeInTheDocument();
    expect(screen.getByText(/5 Available/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Purchase/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Purchase/i })).not.toBeDisabled();
  });

  it('renders out of stock badge when quantity is 0', () => {
    useAuth.mockReturnValue({ isAdmin: false });
    const outOfStockVehicle = { ...mockVehicle, quantity: 0 };

    render(
      <MemoryRouter>
        <VehicalCard
          vehicle={outOfStockVehicle}
          onPurchase={vi.fn()}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Purchase/i })).toBeInTheDocument();
  });

  it('calls view detail handler on click', () => {
    useAuth.mockReturnValue({ isAdmin: false });
    const mockOnViewDetail = vi.fn();

    render(
      <MemoryRouter>
        <VehicalCard
          vehicle={mockVehicle}
          onViewDetail={mockOnViewDetail}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Purchase/i }));
    expect(mockOnViewDetail).toHaveBeenCalledWith(mockVehicle);
  });

  it('renders admin controls (edit, delete, restock) only for admin users', () => {
    // Test for Standard User:
    useAuth.mockReturnValue({ isAdmin: false });
    const { rerender } = render(
      <MemoryRouter>
        <VehicalCard
          vehicle={mockVehicle}
          onPurchase={vi.fn()}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByPlaceholderText('Qty')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Restock/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();

    // Test for Admin User:
    useAuth.mockReturnValue({ isAdmin: true });
    rerender(
      <MemoryRouter>
        <VehicalCard
          vehicle={mockVehicle}
          onPurchase={vi.fn()}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Qty')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Restock/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('calls restock handler on submit with valid qty', () => {
    useAuth.mockReturnValue({ isAdmin: true });
    const mockOnRestock = vi.fn();

    render(
      <MemoryRouter>
        <VehicalCard
          vehicle={mockVehicle}
          onPurchase={vi.fn()}
          onDelete={vi.fn()}
          onRestock={mockOnRestock}
        />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Qty');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Restock/i }));

    expect(mockOnRestock).toHaveBeenCalledWith(mockVehicle.id, 10);
  });
});
