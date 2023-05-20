import { BrowserRouter } from 'react-router-dom';
import Error from './Error'
import { render, screen, waitFor } from '@testing-library/react';

test('should display error', async () => {
    render(
        <BrowserRouter>
            <Error visible={true} text='test error' />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryByText('test error')).toBeInTheDocument()
    })
});

test('should not display error', async () => {
    render(
        <BrowserRouter>
            <Error visible={false} text='test error' />
        </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.queryByText('test error')).not.toBeInTheDocument()
    })
});
