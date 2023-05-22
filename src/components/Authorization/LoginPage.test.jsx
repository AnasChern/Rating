import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

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
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject(fakeResponse));
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
        expect(screen.queryByText('wrong password')).toBeInTheDocument()
    })
});

test('should have input fields', async () => {
    act(() => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    });
    const userName = screen.queryByTestId('input-userName')
    fireEvent.change(userName, { target: { value: 'hokereck' } })
    const password = screen.queryByTestId('input-password')
    fireEvent.change(password, { target: { value: 'dfghjhgf45' } })


    await waitFor(() => {
        expect(screen.getByDisplayValue("hokereck")).toBeInTheDocument()
        expect(screen.getByDisplayValue("dfghjhgf45")).toBeInTheDocument()
    })

});

test('should not show current user rating', async () => {
    global.fetch = jest.fn(() => Promise.reject('server error'))
    const mockedFunction = jest.fn();
    //const fakeResponse = { access_token: "edrftgyhjuki567", userid: "32" };
    //jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
    //    json: () => Promise.resolve(fakeResponse)
    //}));
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
        const s = screen.queryByText('server error')
        expect(s).toBeInTheDocument()
    })
});

test('should login user', async () => {
    const mockedFunction = jest.fn();
    const fakeResponse = 'error token';
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
        expect(screen.queryByText('error token')).toBeInTheDocument()
        expect(mockedNavigate).not.toHaveBeenCalledWith('/')
        expect(mockedFunction).not.toHaveBeenCalledWith(true)
    })

});
