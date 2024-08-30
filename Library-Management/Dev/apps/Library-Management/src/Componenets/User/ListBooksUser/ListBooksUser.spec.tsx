import { render } from '@testing-library/react';

import ListBooksUser from './ListBooksUser';

describe('ListBooksUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListBooksUser />);
    expect(baseElement).toBeTruthy();
  });
});
