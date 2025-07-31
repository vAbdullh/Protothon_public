import React from 'react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import LanguageSwitcher from './language-switcher';

export const UIControls = () => {
    return (
        <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <LanguageSwitcher />
        </div>
    );
};

export default UIControls;