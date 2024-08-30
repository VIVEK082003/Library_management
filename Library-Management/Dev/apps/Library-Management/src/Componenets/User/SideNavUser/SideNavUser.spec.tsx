import { render } from '@testing-library/react';

import SideNavUser from './SideNavUser';

describe('SideNavUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SideNavUser />);
    expect(baseElement).toBeTruthy();
  });
});
