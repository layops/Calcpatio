import {createMuiTheme} from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

export const getTheme = (mode = 'light') => {
    const isDark = mode === 'dark';

    return createMuiTheme({
        palette: {
            type: isDark ? 'dark' : 'light',
            background: isDark
                ? {
                    dark: '#070B14',
                    default: '#0B0F19',
                    paper: '#111827'
                }
                : {
                    dark: '#F1F5F9',
                    default: '#F8FAFC',
                    paper: '#FFFFFF'
                },
            primary: {
                light: '#60A5FA',
                main: '#2563EB',
                dark: '#1D4ED8',
                contrastText: '#FFFFFF'
            },
            secondary: isDark
                ? {
                    light: '#94A3B8',
                    main: '#CBD5E1',
                    dark: '#F8FAFC',
                    contrastText: '#0F172A'
                }
                : {
                    light: '#64748B',
                    main: '#0F172A',
                    dark: '#020617',
                    contrastText: '#FFFFFF'
                },
            success: {
                main: '#10B981'
            },
            text: isDark
                ? {
                    primary: '#F8FAFC',
                    secondary: '#94A3B8'
                }
                : {
                    primary: '#0F172A',
                    secondary: '#64748B'
                },
            divider: isDark ? '#1F2937' : '#E2E8F0'
        },
        shape: {
            borderRadius: 12
        },
        shadows,
        typography,
        overrides: {
            MuiButton: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 20px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                },
                containedPrimary: {
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.35)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
                        transform: 'translateY(-1px)'
                    }
                }
            },
            MuiCard: {
                root: {
                    borderRadius: 16,
                    border: `1px solid ${isDark ? '#1F2937' : '#E2E8F0'}`,
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    boxShadow: isDark 
                        ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' 
                        : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease'
                }
            },
            MuiPaper: {
                root: {
                    transition: 'background-color 0.2s ease, color 0.2s ease'
                }
            },
            MuiOutlinedInput: {
                root: {
                    borderRadius: 10,
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    '&:hover $notchedOutline': {
                        borderColor: isDark ? '#4B5563' : '#94A3B8'
                    },
                    '&$focused $notchedOutline': {
                        borderColor: '#3B82F6',
                        borderWidth: 2
                    }
                },
                notchedOutline: {
                    borderColor: isDark ? '#374151' : '#CBD5E1'
                },
                input: {
                    color: isDark ? '#F8FAFC' : '#0F172A'
                }
            },
            MuiInputLabel: {
                root: {
                    color: isDark ? '#94A3B8' : '#64748B',
                    '&$focused': {
                        color: isDark ? '#60A5FA' : '#2563EB'
                    }
                }
            },
            MuiTableCell: {
                root: {
                    borderColor: isDark ? '#1F2937' : '#F1F5F9',
                    padding: '14px 16px',
                    color: isDark ? '#E2E8F0' : '#334155'
                },
                head: {
                    fontWeight: 700,
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#CBD5E1' : '#475569',
                    fontSize: '0.785rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }
            },
            MuiTableRow: {
                hover: {
                    '&:hover': {
                        backgroundColor: (isDark ? '#1E293B !important' : '#F8FAFC !important')
                    }
                }
            },
            MuiDivider: {
                root: {
                    backgroundColor: isDark ? '#1F2937' : '#E2E8F0'
                }
            }
        }
    });
};

const defaultTheme = getTheme('light');
export default defaultTheme;
