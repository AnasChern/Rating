import { BrowserRouter } from 'react-router-dom';
import RatingTable from './RatingTable'
import { unmountComponentAtNode } from "react-dom";
import { render, screen, waitFor } from '@testing-library/react';

test('should have 3 rows', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'Tent', score: '189', id: '23' },
    { firstname: 'Rave1', lastName: 'Tent1', score: '180', id: '231' },
    { firstname: 'Rave2', lastName: 'Tent2', score: '179', id: '232' }]

    render(
        <BrowserRouter>
            <RatingTable ratingRows={fakeRatingRows} />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryAllByTestId('table-row')).toHaveLength(3)

    })
});

test('should have 1 rows', async () => {
    const fakeRatingRows = [{ firstname: 'Rave', lastName: 'Tent', score: '189', id: '23' }]

    render(
        <BrowserRouter>
            <RatingTable ratingRows={fakeRatingRows} />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryAllByTestId('table-row')).toHaveLength(1)

    })
});

test('should have 0 rows', async () => {
    const fakeRatingRows = null

    render(
        <BrowserRouter>
            <RatingTable ratingRows={fakeRatingRows} />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryAllByTestId('table-row')).toHaveLength(0)

    })
});