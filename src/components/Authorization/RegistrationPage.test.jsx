import { BrowserRouter } from 'react-router-dom';
import RegistrationPage from './RegistrationPage'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

test('should register user', async () => {
    const fakeResponse = { status: 200 };
    const a = jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
        status: 200, json: () => Promise.resolve(fakeResponse)
    }));
    await act(async () => {
        render(
            <BrowserRouter>
                <RegistrationPage />
            </BrowserRouter>
        );
    });
    const registerBtn = screen.queryByText('Register')
    act(() => {
        registerBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/login')
    })
});

test('should not to be register user', async () => {
    const fakeResponse = { Response: 'username is already used' };
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject({
        json: () => Promise.resolve(fakeResponse)
    }));
    await act(async() => {
        render(
            <BrowserRouter>
                <RegistrationPage />
            </BrowserRouter>
        );
    });
    const registerBtn = screen.queryByText('Register')
    act(() => {
        registerBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(mockedNavigate).not.toBeCalled()

    })
    await waitFor(() => {
        expect(screen.queryByText('username is already used'))
    })
});

test('should go to login page', async () => {
    await act(async() => {
        render(
            <BrowserRouter>
                <RegistrationPage />
            </BrowserRouter>
        );
    });
    const loginLink = screen.queryByTestId('login-link')
    act(() => {
        loginLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith('/login', { preventScrollReset: undefined, relative: undefined, replace: false, state: undefined })
    })
});

test('should have input fields', async () => {
    act(() => {
        render(
            <BrowserRouter>
                <RegistrationPage />
            </BrowserRouter>
        );
    });
    await waitFor(() => {
        expect(screen.queryByText('Account Registration')).toBeInTheDocument()
        expect(screen.queryByText('First name')).toBeInTheDocument()
        expect(screen.queryByText('Last name')).toBeInTheDocument()
        expect(screen.queryByText('Username')).toBeInTheDocument()
        expect(screen.queryByText('Email')).toBeInTheDocument()
        expect(screen.queryByText('Phone')).toBeInTheDocument()
        expect(screen.queryByText('Role')).toBeInTheDocument()
        expect(screen.queryByText('Password')).toBeInTheDocument()

    })
    const lastName = screen.queryByTestId('last-name-input')
    fireEvent.change(lastName, { target: { value: 'Hoke' } })
    const firstName = screen.queryByTestId('first-name-input')
    fireEvent.change(firstName, { target: { value: 'Reck' } })
    const userName = screen.queryByTestId('user-name-input')
    fireEvent.change(userName, { target: { value: 'hokereck' } })
    const email = screen.queryByTestId('email-input')
    fireEvent.change(email, { target: { value: 'hokereck@gmail.com' } })
    const tel = screen.queryByTestId('tel-input')
    fireEvent.change(tel, { target: { value: "0987654368" } })
    const password = screen.queryByTestId('password-input')
    fireEvent.change(password, { target: { value: 'dfghjhgf45' } })


    await waitFor(() => {
        expect(screen.getByDisplayValue("Hoke")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Reck")).toBeInTheDocument()
        expect(screen.getByDisplayValue("hokereck")).toBeInTheDocument()
        expect(screen.getByDisplayValue("hokereck@gmail.com")).toBeInTheDocument()
        expect(screen.getByDisplayValue("0987654368")).toBeInTheDocument()
        expect(screen.getByDisplayValue("dfghjhgf45")).toBeInTheDocument()
    })

});

test('should register user', async () => {
    const fakeResponse = {Response:"error status"};
    const a = jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({
        status: 404, json: () => Promise.resolve(fakeResponse)
    }));
    await act(async () => {
        render(
            <BrowserRouter>
                <RegistrationPage />
            </BrowserRouter>
        );
    });
    const registerBtn = screen.queryByText('Register')
    act(() => {
        registerBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => {
        expect(screen.queryByText('error status')).toBeInTheDocument()
        expect(mockedNavigate).not.toHaveBeenCalledWith('/login')
    })
});
