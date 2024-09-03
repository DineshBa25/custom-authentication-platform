import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import UserAuthForm from '../../../components/auth/forms/user-auth-form';
import { useRouter } from 'next/navigation';
import fetch from 'jest-fetch-mock';

// Mock ResizeObserver
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('UserAuthForm', () => {
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({
            prefetch: () => null,
            push: mockRouterPush,
        });

        // Mock the fetch response
        fetch.mockResponseOnce(JSON.stringify({ success: true }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the form correctly', () => {
        render(<UserAuthForm />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('handles form submission', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in with email/i }));
        });

        expect(mockRouterPush).toHaveBeenCalledWith('/inbox');
    });

    test('handles no password submission', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in with email/i }));
        });

        expect(mockRouterPush).not.toHaveBeenCalled();
        expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument();
    });

    test('handles no email submission', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in with email/i }));
        });

        expect(mockRouterPush).not.toHaveBeenCalled();
        expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument();
    });

    test('handles no information submission', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in with email/i }));
        });

        expect(mockRouterPush).not.toHaveBeenCalled();
        expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument();
    });

    test('toggles password visibility', async () => {
        render(<UserAuthForm />);

        const passwordInput = screen.getByLabelText('Password');
        const showPasswordCheckbox = screen.getByLabelText('Show password');

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.type).toBe('password');

        fireEvent.click(showPasswordCheckbox);
        expect(passwordInput.type).toBe('text');

        fireEvent.click(showPasswordCheckbox);
        expect(passwordInput.type).toBe('password');
    })
    test('form inputs and button are disabled when loading', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /sign in with email/i });
        fireEvent.click(submitButton);

        // Wait for the form submission to complete
        await waitFor(() => expect(submitButton).toBeDisabled());

        expect(screen.getByLabelText('Email')).toBeDisabled();
        expect(screen.getByLabelText('Password')).toBeDisabled();
    });

    test('resets error message when typing after error', async () => {
        render(<UserAuthForm />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in with email/i }));
        });

        expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });

        expect(screen.queryByText('Please enter your email and password.')).not.toBeInTheDocument();
    });
});
