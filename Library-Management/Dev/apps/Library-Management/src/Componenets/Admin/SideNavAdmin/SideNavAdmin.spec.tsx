import { render } from '@testing-library/react';

import SideNavAdmin from './SideNavAdmin';

describe('SideNavAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SideNavAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
