import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { render, screen, waitFor } from '@testing-library/react';

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedNavigate,
}));

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test('should login user', async () => {
    const mockedFunction = jest.fn();
    const fakeResponse = { access_token: "edrftgyhjuki567", userid: "32" };
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(fakeResponse)
    }));
    await act(async() => {
        render(
            <BrowserRouter>
                <LoginPage setIsLoggedIn={mockedFunction} />
            </BrowserRouter>
        );
    });
    const loginBtn = screen.queryByText('Login to your Account!')
    act(() => {
        loginBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/')
        expect(mockedFunction).toHaveBeenCalledWith(true)
    })

});

test('should not to be login user', async () => {
    const mockedFunction = jest.fn();
    const fakeResponse = 'wrong password';
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject({
        json: () => Promise.resolve(fakeResponse)
    }));
    act(() => {
        render(
            <BrowserRouter>
                <LoginPage setIsLoggedIn={mockedFunction} />
            </BrowserRouter>
        );
    });
    const loginBtn = screen.queryByText('Login to your Account!')
    act(() => {
        loginBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(mockedNavigate).not.toBeCalled()
        expect(mockedFunction).not.toBeCalled()
    })
    await waitFor(() => {
        expect(screen.queryByText('wrong password'))
    })
});

