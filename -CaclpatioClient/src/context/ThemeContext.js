import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ThemeProvider} from '@material-ui/core';
import {getTheme} from '../theme';

const ThemeModeContext = createContext({
    mode: 'light',
    toggleTheme: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({children}) => {
    const [mode, setMode] = useState(() => {
        try {
            const saved = localStorage.getItem('themeMode');
            if (saved === 'dark' || saved === 'light') {
                return saved;
            }
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) {
            console.error('Theme detection error:', e);
        }
        return 'light';
    });

    useEffect(() => {
        try {
            localStorage.setItem('themeMode', mode);
            // Add or remove dark class to body for any direct CSS needs
            if (mode === 'dark') {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        } catch (e) {
            console.error('LocalStorage write error:', e);
        }
    }, [mode]);

    const toggleTheme = () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeModeContext.Provider value={{mode, toggleTheme}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
