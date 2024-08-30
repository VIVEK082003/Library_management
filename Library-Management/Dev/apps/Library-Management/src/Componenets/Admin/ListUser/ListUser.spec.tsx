import { render } from '@testing-library/react';

import ListUser from './ListUser';

describe('ListUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListUser />);
    expect(baseElement).toBeTruthy();
  });
});
