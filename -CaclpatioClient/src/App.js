import React from 'react';
import {ThemeProvider} from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import {Provider} from "react-redux";
import store from "./redux/store";
import Routing from "./components/Routing";


const App = () => {

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <GlobalStyles/>
                <Routing/>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
