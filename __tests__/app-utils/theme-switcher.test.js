import { render, screen } from '@testing-library/react';
import {ModeToggle} from '../../components/app-utils/theme-switcher';
import React from 'react';
describe('ModeToggle', () => {
    it('renders correctly', () => {
        render(<ModeToggle />);

        const button = screen.getByRole('button', { name: /Toggle theme/i });
        expect(button).toBeInTheDocument();
    });
});
describe('ModeToggle', () => {
    it('renders correctly', () => {
        render(<ModeToggle />);

        const button = screen.getByRole('button', { name: /Toggle theme/i });
        expect(button).toBeInTheDocument();

        const sunIcon = screen.getByRole('img', { name: /Sun icon/i });
        expect(sunIcon).toBeInTheDocument();

        const moonIcon = screen.getByRole('img', { name: /Moon icon/i });
        expect(moonIcon).toBeInTheDocument();
    });
});