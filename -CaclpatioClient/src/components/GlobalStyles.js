import {createStyles, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            backgroundColor: '#F8FAFC',
            fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#0F172A',
            height: '100%',
            width: '100%'
        },
        '::-webkit-scrollbar': {
            width: 8,
            height: 8
        },
        '::-webkit-scrollbar-track': {
            background: '#F1F5F9'
        },
        '::-webkit-scrollbar-thumb': {
            background: '#CBD5E1',
            borderRadius: 4
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: '#94A3B8'
        },
        a: {
            textDecoration: 'none'
        },
        '#root': {
            height: '100%',
            width: '100%'
        }
    }
}));

const GlobalStyles = () => {
    useStyles();

    return null;
};

export default GlobalStyles;
