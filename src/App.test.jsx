import { BrowserRouter } from 'react-router-dom';
import App from './App'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';


const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedNavigate,
}));


const localStorageMock = (function () {
    let store = { userid: '12', access_token: 'sdgfhgjhkjk45ddgxfhgfvhb6' };
    return {
        getItem(key) {
            return store[key];
        },
        setItem(key, value) {
            store[key] = value;
        },
        clear() {
            store = {};
        },
        removeItem(key) {
            delete store[key];
        },
        getAll() {
            return store;
        },
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });



test('should show current user rating', async () => {
    const fakeScoreResponce = { score: '156' }

    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce), status: 200
    }))
    act(() => {
        render(
            <App />
        );
    });
    await waitFor(() => {
        const s = screen.queryByText('My Rating: 156')
        expect(s).toBeInTheDocument()
    })
});

test('should show current user rating', async () => {
    global.fetch = jest.fn(() => Promise.reject('server error'))
    act(() => {
        render(
            <App />
        );
    });
    await waitFor(() => {
        const s = screen.queryByText('My Rating: 156')
        expect(s).not.toBeInTheDocument()
    })
});