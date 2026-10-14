import {createStyles, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
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
            backgroundColor: theme.palette.background.default,
            fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: theme.palette.text.primary,
            height: '100%',
            width: '100%',
            transition: 'background-color 0.25s ease, color 0.25s ease'
        },
        '::-webkit-scrollbar': {
            width: 8,
            height: 8
        },
        '::-webkit-scrollbar-track': {
            background: theme.palette.type === 'dark' ? '#0B0F19' : '#F1F5F9'
        },
        '::-webkit-scrollbar-thumb': {
            background: theme.palette.type === 'dark' ? '#374151' : '#CBD5E1',
            borderRadius: 4
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.type === 'dark' ? '#4B5563' : '#94A3B8'
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
