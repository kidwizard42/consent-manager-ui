import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders learn react link', () => {
    const { getByText } = render(<App />);
    const prefsButton = getByText(/data collection preferences/i);
    expect(document.body.contains(prefsButton));
    // expect(42).to.equal(42);
  });
});
