import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});
