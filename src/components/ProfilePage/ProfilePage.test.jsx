import { BrowserRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedNavigate,
}));

const localStorageMock = (function () {
    let store = { userid: '12' };
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

test('should fetch user', async () => {
    const fakeUser = {
        firstname: "Anastasiia",
        lastName: "Chernenko",
        username: "ana56",
        email: "ana@gmail.com",
        phone: "0753532578",
        role: "STUDENT"
    }

    const fakeScoreResponce = { score: "193" }
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce), status: 200

    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeUser), status: 200 })
    const mockedFunction = jest.fn()
    await act(async () => {
        render(
            <BrowserRouter>
                <ProfilePage setUserRating={mockedFunction} />
            </BrowserRouter>
        );
    });
    await waitFor(() => {
        expect(screen.queryByDisplayValue('Anastasiia')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('Chernenko')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('ana56')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('ana@gmail.com')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('0753532578')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('STUDENT')).toBeInTheDocument()
        expect(screen.queryByText('Your Personal Information')).toBeInTheDocument()
    })

});

test('should edit user', async () => {
    const fakeUser = {
        firstname: "Anastasiia",
        lastName: "Chernenko",
        username: "ana56",
        email: "ana@gmail.com",
        phone: "0753532578",
        role: "STUDENT"
    }
    const fakeEditUser = {
        firstname: "Nastiia",
        lastName: "Cher",
        username: "nastiia56",
        email: "nastiia@gmail.com",
        phone: "0983532578",
        role: "STUDENT"
    }

    const fakeScoreResponce = { score: "193" }
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce), status: 200

    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeUser), status: 200 })
    const mockedFunction = jest.fn()
    await act(async () => {
        render(
            <BrowserRouter>
                <ProfilePage setUserRating={mockedFunction} />
            </BrowserRouter>
        );
    });
    const button = screen.queryByTestId("edit-button-user")
    fireEvent.click(button)
    fireEvent.change(screen.queryByDisplayValue("Anastasiia"), { target: { value: 'Nastiia' } })
    fireEvent.change(screen.queryByDisplayValue("Chernenko"), { target: { value: 'Cher' } })
    fireEvent.change(screen.queryByDisplayValue("ana56"), { target: { value: 'nastiia56' } })
    fireEvent.change(screen.queryByDisplayValue("ana@gmail.com"), { target: { value: 'nastiia@gmail.com' } })
    fireEvent.change(screen.queryByDisplayValue("0753532578"), { target: { value: '0983532578' } })
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeEditUser), status: 200 })
    await act(async () => {
        fireEvent.click(button)
    });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeEditUser), status: 200 })
    await waitFor(() => {
        expect(screen.queryByDisplayValue('Nastiia')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('Cher')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('nastiia56')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('nastiia@gmail.com')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('0983532578')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('STUDENT')).toBeInTheDocument()
    })
});

test('should edit score', async () => {
    const fakeUser = {
        firstname: "Anastasiia",
        lastName: "Chernenko",
        username: "ana56",
        email: "ana@gmail.com",
        phone: "0753532578",
        role: "STUDENT"
    }
    const fakeScoreResponce = { score: "193" }
    const fakeEditScore = { score: "180" }

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeUser), status: 200 })
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeScoreResponce), status: 200 })
    const mockedFunction = jest.fn()
    await act(async () => {
        render(
            <BrowserRouter>
                <ProfilePage setUserRating={mockedFunction} />
            </BrowserRouter>
        );
    });
    const button = screen.queryByTestId("edit-button-score")
    fireEvent.click(button)
    fireEvent.change(screen.queryByDisplayValue("193"), { target: { value: "180" } })
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeEditScore), status: 200 })
    await act(async () => {
        fireEvent.click(button)
    });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeUser), status: 200 })
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeEditScore), status: 200 })
    await waitFor(() => {
        expect(screen.queryByDisplayValue('180')).toBeInTheDocument()
    })
});
