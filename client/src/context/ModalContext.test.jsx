import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ModalProvider, useModal } from './ModalContext';

const TestComponent = () => {
    const { confirm, prompt } = useModal();
    
    return (
        <div>
            <button onClick={async () => {
                const res = await confirm({ title: 'Test Confirm', message: 'Yes or no?', confirmText: 'Yes', cancelText: 'No' });
                document.getElementById('result').textContent = String(res);
            }}>
                Show Confirm
            </button>
            <button onClick={async () => {
                const res = await prompt({ title: 'Test Prompt', message: 'Enter text', submitText: 'Send' });
                document.getElementById('result').textContent = String(res);
            }}>
                Show Prompt
            </button>
            <div id="result"></div>
        </div>
    );
};

// Mock HTMLDialogElement methods that JSDOM doesn't support fully
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function() {
        this.open = true;
        // Mock the backdrop click bounding rect since JSDOM doesn't layout
        this.getBoundingClientRect = () => ({
            top: 0, bottom: 500, left: 0, right: 500
        });
    };
    HTMLDialogElement.prototype.close = function() {
        this.open = false;
    };
});

describe('ModalContext', () => {
    it('handles confirm dialog resolution', async () => {
        const user = userEvent.setup();
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );

        // Open confirm
        await user.click(screen.getByText('Show Confirm'));
        expect(screen.getByText('Test Confirm')).toBeInTheDocument();
        
        // Click confirm
        await user.click(screen.getByText('Yes'));
        await waitFor(() => {
            expect(document.getElementById('result').textContent).toBe('true');
        });
    });

    it('handles confirm dialog cancellation', async () => {
        const user = userEvent.setup();
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );

        // Open confirm
        await user.click(screen.getByText('Show Confirm'));
        
        // Click cancel
        await user.click(screen.getByText('No'));
        await waitFor(() => {
            expect(document.getElementById('result').textContent).toBe('false');
        });
    });

    it('handles prompt dialog submission', async () => {
        const user = userEvent.setup();
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );

        // Open prompt
        await user.click(screen.getByText('Show Prompt'));
        
        // Type into input
        const input = screen.getByRole('textbox');
        await user.type(input, 'Hello World');
        
        // Click submit
        await user.click(screen.getByText('Send'));
        await waitFor(() => {
            expect(document.getElementById('result').textContent).toBe('Hello World');
        });
    });
});
