import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Footer from "@components/footer/Footer";

vi.mock('@mui/icons-material/Home', () => ({
  __esModule: true,
  default: () => <span>MockedHomeIcon</span>,
}));
vi.mock('@mui/icons-material/PinDrop', () => ({
  __esModule: true,
  default: () => <span>MockedPinDropIcon</span>,
}));
vi.mock('@mui/icons-material/ForkRight', () => ({
  __esModule: true,
  default: () => <span>MockedForkRightIcon</span>,
}));
vi.mock('@mui/icons-material/Notifications', () => ({
  __esModule: true,
  default: () => <span>MockedNotificationsIcon</span>,
}));

describe('Footer Component', () => {
  test('renders Footer component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(getByText('MockedHomeIcon')).toBeInTheDocument();
    expect(getByText('MockedPinDropIcon')).toBeInTheDocument();
    expect(getByText('MockedForkRightIcon')).toBeInTheDocument();
    expect(getByText('MockedNotificationsIcon')).toBeInTheDocument();
  });

  test('active link is highlighted for /zonas', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/zonas']}>
        <Footer />
      </MemoryRouter>
    );

    const activeLink = container.querySelector('.active');
    expect(activeLink).toBeInTheDocument();
    expect(activeLink.getAttribute('href')).toBe('/zonas');
  });

  test('active link is highlighted for /recorridos', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/recorridos']}>
        <Footer />
      </MemoryRouter>
    );

    const activeLink = container.querySelector('.active');
    expect(activeLink).toBeInTheDocument();
    expect(activeLink.getAttribute('href')).toBe('/recorridos');
  });

  test('no active link is highlighted for unmatched path', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/unmatched-path']}>
        <Footer />
      </MemoryRouter>
    );

    const activeLink = container.querySelector('.active');
    expect(activeLink).not.toBeInTheDocument();
  });
  
});