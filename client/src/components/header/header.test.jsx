import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Header from './header';
import { getByText, getByPlaceholderText } from '@testing-library/react'; // Import getByPlaceholderText
import reducers from '../../store';

const mockStore = createStore(reducers); // Replace with the actual rootReducer

describe('Header Component', () => {
    it('should filter classes when search input changes', () => {
        const { getByPlaceholderText, getByText } = render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        );

        const searchInput = getByPlaceholderText("Search certificate or level...");
        fireEvent.change(searchInput, { target: { value: 'aws' } });

        // Assuming your component renders a filtered class list
        // You can check if the filtered class list is updated as expected
        // and if the expected class is displayed
        const filteredClass = getByText("The AWS Certified Solutions Architect");
        expect(filteredClass).toBeInTheDocument();
    });
});
