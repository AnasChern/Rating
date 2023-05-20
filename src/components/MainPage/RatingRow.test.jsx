import { BrowserRouter } from 'react-router-dom';
import RatingRow from './RatingRow'
import { unmountComponentAtNode } from "react-dom";
import { render, screen, waitFor } from '@testing-library/react';

let table = null;
beforeEach(() => {
    table = document.createElement('table');
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)
    document.body.appendChild(table);

});

afterEach(() => {
    unmountComponentAtNode(table);
    table.remove();
    table = null;
});

test('should display data', async () => {

    render(
        <BrowserRouter>
            <table>
                <tbody>
                    <RatingRow firstName={'Kole'} lastName={'West'} score={190} />
                </tbody>
            </table>
        </BrowserRouter>, table
    );
    await waitFor(() => {
        expect(screen.queryByText('Kole')).toBeInTheDocument()
        expect(screen.queryByText('West')).toBeInTheDocument()
        expect(screen.queryByText('190')).toBeInTheDocument()
    })
});