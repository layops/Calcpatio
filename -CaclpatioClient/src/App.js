import React from 'react';
import GlobalStyles from './components/GlobalStyles';
import {Provider} from "react-redux";
import store from "./redux/store";
import Routing from "./components/Routing";
import {ThemeModeProvider} from "./context/ThemeContext";

const App = () => {
    return (
        <Provider store={store}>
            <ThemeModeProvider>
                <GlobalStyles/>
                <Routing/>
            </ThemeModeProvider>
        </Provider>
    );
};

export default App;
