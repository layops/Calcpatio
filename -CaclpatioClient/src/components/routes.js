import React from 'react';
import {Navigate} from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import NotFoundView from '../views/errors/NotFoundView';
import PolyCarbonCalculate from "../views/calculate/PolyCarbonCalculate";
import GlassCalculate from "../views/calculate/GlassCalculate/";

const getRoutes = () => {
    return [
        {
            path: '/',
            element: <DashboardLayout/>,
            children: [
                {path: '/', element: <Navigate to="/polyCarbonCalculate"/>},
                {path: 'login', element: <Navigate to="/polyCarbonCalculate"/>},
                {path: 'register', element: <Navigate to="/polyCarbonCalculate"/>},
                {path: 'settings', element: <Navigate to="/polyCarbonCalculate"/>},
                {path: 'polyCarbonCalculate', element: <PolyCarbonCalculate/>},
                {path: 'glassCalculate', element: <GlassCalculate/>},
                {path: '404', element: <NotFoundView/>},
                {path: '*', element: <Navigate to="/polyCarbonCalculate"/>}
            ]
        }
    ];
};



export default getRoutes;
