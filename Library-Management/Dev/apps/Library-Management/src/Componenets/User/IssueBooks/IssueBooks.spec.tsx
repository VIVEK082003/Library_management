import { render } from '@testing-library/react';

import IssueBooks from './IssueBooks';

describe('IssueBooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IssueBooks />);
    expect(baseElement).toBeTruthy();
  });
});
