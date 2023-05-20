import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedNavigate,
}));

test('should fetch users', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'Tent', id: '123' },
    { firstname: 'Rave1', lastName: 'Tent1', id: '331' },
    { firstname: 'Rave2', lastName: 'Tent2', id: '332' }]

    const fakeScoreResponce = [{ student_id: '331', score: '156' },
    { student_id: '123', score: '146' },
    { student_id: '332', score: '166' }]
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce)
    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeRatingRows) })
    act(() => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });
    await waitFor(() => {
        const s = screen.queryByText('Tent')
        expect(screen.queryAllByTestId('table-row')).toHaveLength(3)
        expect(s).toBeInTheDocument()
    })
});

test('should search user', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'NTent', id: '123' },
    { firstname: 'Rave1', lastName: 'ATent1', id: '331' },
    { firstname: 'Rave2', lastName: 'TTent2', id: '332' }]

    const fakeScoreResponce = [{ student_id: '331', score: '156' },
    { student_id: '123', score: '146' },
    { student_id: '332', score: '166' }]
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce)
    }))

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeRatingRows) })
    await act(async () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });
    const search = screen.queryByTestId('search')
    fireEvent.change(search, { target: { value: 'ATent1' } })
    await waitFor(() => {
        expect(screen.queryByText('TTent2')).not.toBeInTheDocument()
        expect(screen.queryByText('ATent1')).toBeInTheDocument()
        expect(screen.queryByText('NTent')).not.toBeInTheDocument()
    })

});


test('should sort user by last name', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'NTent', id: '123' },
    { firstname: 'Rave1', lastName: 'ATent1', id: '331' },
    { firstname: 'Rave2', lastName: 'TTent2', id: '332' }]

    const fakeScoreResponce = [{ student_id: '331', score: '156' },
    { student_id: '123', score: '146' },
    { student_id: '332', score: '166' }]
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce)
    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeRatingRows) })
    await act(async () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });
    const sortSelect = screen.queryByTestId('sortSelect')
    fireEvent.change(sortSelect, { target: { value: 'Last name' } })
    await waitFor(() => {
        expect(sortSelect.value).toBe('Last name')
        const users = screen.getAllByTestId('table-row', { exact: false })
        expect(users[0]).toHaveTextContent('ATent1')
        expect(users[1]).toHaveTextContent('NTent')
        expect(users[2]).toHaveTextContent('TTent2')
    })

});

test('should sort user by last name (if last name same)', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'TTent', id: '123' },
    { firstname: 'Rave1', lastName: 'ATent', id: '331' },
    { firstname: 'Rave2', lastName: 'ATent', id: '332' }]

    const fakeScoreResponce = [{ student_id: '331', score: '156' },
    { student_id: '123', score: '146' },
    { student_id: '332', score: '166' }]
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce)
    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeRatingRows) })
    await act(async () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });
    const sortSelect = screen.queryByTestId('sortSelect')
    fireEvent.change(sortSelect, { target: { value: 'Last name' } })
    await waitFor(() => {
        expect(sortSelect.value).toBe('Last name')
        const users = screen.getAllByTestId('table-row', { exact: false })
        expect(users[0]).toHaveTextContent('ATent')
        expect(users[1]).toHaveTextContent('ATent')
        expect(users[2]).toHaveTextContent('TTent')
    })

});

test('should sort user by score', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'NTent', id: '123' },
    { firstname: 'Rave1', lastName: 'ATent1', id: '331' },
    { firstname: 'Rave2', lastName: 'TTent2', id: '332' }]

    const fakeScoreResponce = [{ student_id: '331', score: '156' },
    { student_id: '123', score: '146' },
    { student_id: '332', score: '166' }]
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(fakeScoreResponce)
    }))
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(fakeRatingRows) })
    await act(async () => {
        render(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });
    const sortSelect = screen.queryByTestId('sortSelect')
    fireEvent.change(sortSelect, { target: { value: 'Score' } })
    await waitFor(() => {
        expect(sortSelect.value).toBe('Score')
        const users = screen.getAllByTestId('table-row', { exact: false })
        expect(users[0]).toHaveTextContent('TTent2')
        expect(users[1]).toHaveTextContent('ATent1')
        expect(users[2]).toHaveTextContent('NTent')
    })

});
