import {cleanup, render} from '@testing-library/react';
import {App} from './App.js';
import {afterEach, expect, it} from '@jest/globals'

afterEach(cleanup);

it('App', () => {
    const {getByText} = render(
        <App />,
    );
    expect(getByText(/test/i)).toBeTruthy();
});