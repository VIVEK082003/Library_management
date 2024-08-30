import { render } from '@testing-library/react';

import Lib from './Lib';

describe('Lib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Lib />);
    expect(baseElement).toBeTruthy();
  });
});
