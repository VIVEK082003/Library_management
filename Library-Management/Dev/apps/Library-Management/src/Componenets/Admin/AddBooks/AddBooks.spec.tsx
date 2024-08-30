import { render } from '@testing-library/react';

import AddBooks from './AddBooks';

describe('AddBooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddBooks />);
    expect(baseElement).toBeTruthy();
  });
});
