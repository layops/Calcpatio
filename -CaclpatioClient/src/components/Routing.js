import React from 'react';
import {useSelector} from "react-redux";
import getRoutes from "./routes";
import { useRoutes } from 'react-router-dom';

const Routing = () => {
    const {user} = useSelector(state => state.auth);
    const routing = useRoutes(getRoutes(user));

    return<>
        {routing}
    </>
}


export default Routing;