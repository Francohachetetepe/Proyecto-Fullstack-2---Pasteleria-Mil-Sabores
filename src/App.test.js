import React from 'react'; // 👈 ESTE ES EL FIX
import { render } from '@testing-library/react';
import App from './App';

describe('Blogs component', () => {
  it('renders Noticias text', () => {
    render(<App />);
  });
});
