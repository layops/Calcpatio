import {createMuiTheme} from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
    palette: {
        background: {
            dark: '#F1F5F9',
            default: '#F8FAFC',
            paper: '#FFFFFF'
        },
        primary: {
            light: '#3B82F6',
            main: '#2563EB',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF'
        },
        secondary: {
            light: '#64748B',
            main: '#0F172A',
            dark: '#020617',
            contrastText: '#FFFFFF'
        },
        success: {
            main: '#10B981'
        },
        text: {
            primary: '#0F172A',
            secondary: '#64748B'
        },
        divider: '#E2E8F0'
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
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 10,
                backgroundColor: '#FFFFFF',
                '&:hover $notchedOutline': {
                    borderColor: '#94A3B8'
                },
                '&$focused $notchedOutline': {
                    borderColor: '#2563EB',
                    borderWidth: 2
                }
            },
            notchedOutline: {
                borderColor: '#CBD5E1'
            }
        },
        MuiTableCell: {
            root: {
                borderColor: '#F1F5F9',
                padding: '14px 16px'
            },
            head: {
                fontWeight: 700,
                backgroundColor: '#F8FAFC',
                color: '#475569',
                fontSize: '0.785rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }
        },
        MuiTableRow: {
            hover: {
                '&:hover': {
                    backgroundColor: '#F8FAFC !important'
                }
            }
        }
    }
});

export default theme;
