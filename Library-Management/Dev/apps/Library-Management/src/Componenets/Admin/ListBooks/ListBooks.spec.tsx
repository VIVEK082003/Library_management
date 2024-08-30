import { render } from '@testing-library/react';

import ListBooks from './ListBooks';

describe('ListBooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListBooks />);
    expect(baseElement).toBeTruthy();
  });
});
