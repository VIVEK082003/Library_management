import { render } from '@testing-library/react';

import Requests from './Requests';

describe('Requests', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Requests />);
    expect(baseElement).toBeTruthy();
  });
});
