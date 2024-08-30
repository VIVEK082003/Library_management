import { render } from '@testing-library/react';

import AddGenre from './AddGenre';

describe('AddGenre', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddGenre />);
    expect(baseElement).toBeTruthy();
  });
});
