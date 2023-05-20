import { BrowserRouter } from 'react-router-dom';
import Header from './Header'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { render, screen, waitFor } from '@testing-library/react';

test('should show log-in user button', async () => {
    act(() => {
        render(
            <BrowserRouter>
                <Header isLoggedIn={true} userRating={170} />
            </BrowserRouter>
        );
    })
    await waitFor(() => {
        expect(screen.queryByText('Log out')).toBeInTheDocument()
        expect(screen.queryByText('Log in')).not.toBeInTheDocument()
        expect(screen.queryByText('My Rating: 170')).toBeInTheDocument()
        expect(screen.queryByTestId('user-profile-button')).toBeInTheDocument()
    })
});

test('should show not log-in user button', async () => {
    render(
        <BrowserRouter>
            <Header isLoggedIn={false} />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryByText('Log out')).not.toBeInTheDocument()
        expect(screen.queryByText('Log in')).toBeInTheDocument()
        expect(screen.queryByText('Sign up')).toBeInTheDocument()
        expect(screen.queryByText('My Rating: 170')).not.toBeInTheDocument()
        expect(screen.queryByTestId('user-profile-button')).not.toBeInTheDocument()
    })
});

test('should log out', async () => {
    const setIsLoggedIn = jest.fn();
    const setUserRating = jest.fn();
    render(
        <BrowserRouter>
            <Header isLoggedIn={true} userRating={170} setIsLoggedIn={setIsLoggedIn} setUserRating={setUserRating} />
        </BrowserRouter>
    );
    const button = screen.queryByText('Log out')
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(setIsLoggedIn).toHaveBeenCalledTimes(1);
    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(setUserRating).toHaveBeenCalledTimes(1);
    expect(setUserRating).toHaveBeenCalledWith(null);
});
