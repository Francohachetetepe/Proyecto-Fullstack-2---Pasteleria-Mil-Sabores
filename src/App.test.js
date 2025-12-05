import { render, screen } from '@testing-library/react';
import Blogs from '../src/components/pages/Blogs';

describe('Blogs component', () => {
  it('renders Noticias text', () => {
    render(<Blogs />);
    const element = screen.getByText(/Noticias/i);
    expect(element).not.toBeNull();
  });
});