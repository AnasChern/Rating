import { BrowserRouter } from 'react-router-dom';
import Button from './Button'
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";

import { render, screen, waitFor } from '@testing-library/react';

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

test('should display button', async () => {
    render(
        <BrowserRouter>
            <Button text='test' />
        </BrowserRouter>, container
    );
    await waitFor(() => {
        expect(screen.queryByText('test')).toBeInTheDocument()
    })
});

test('should call function on click', async () => {
    const mockedFunction = jest.fn();
    render(
        <BrowserRouter>
            <Button text='test' onClick={mockedFunction} />
        </BrowserRouter>, container
    );
    const button = screen.queryByText('test')
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockedFunction).toHaveBeenCalledTimes(1);
    act(() => {
        for (let i = 0; i < 5; i++) {
            button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
    });
    expect(mockedFunction).toHaveBeenCalledTimes(6);
});

test('should be visible on mobile', async () => {
    act(() => {
        render(
            <BrowserRouter>
                <Button text='test' isMobile={true} />

            </BrowserRouter>, container
        )
    });
    await waitFor(() => {
        expect(screen.queryByText('test').classList).toContain('edit-button-mobile')
        expect(screen.queryByText('test').classList).not.toContain('edit-button')
    })
});

test('should not be visible on mobile', async () => {
    act(() => {
        render(
            <BrowserRouter>
                <Button text='test' isMobile={false} />
            </BrowserRouter>, container
        )
    });
    await waitFor(() => {
        expect(screen.queryByText('test').classList).not.toContain('edit-button-mobile')
        expect(screen.queryByText('test').classList).toContain('edit-button')
    })
});