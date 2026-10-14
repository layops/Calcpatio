import React from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import GlassCalculator from "./GlassCalculator";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const WindowCalculate = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="Cam Hesaplama"
        >
            <Container maxWidth="xl">
                <Box mt={3}>
                    <GlassCalculator/>
                </Box>
            </Container>
        </Page>
    );
};

export default WindowCalculate;
