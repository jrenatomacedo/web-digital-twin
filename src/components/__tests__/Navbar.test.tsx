import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';
import '@testing-library/jest-dom';

describe('Navbar Component', () => {
  it('renders correctly with desktop links', () => {
    render(<Navbar />);
    expect(screen.getByText('José', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });
});
