import React from 'react';
import {Navigate} from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import LoginView from '../views/auth/LoginView';
import RegisterView from '../views/auth/RegisterView';
import NotFoundView from '../views/errors/NotFoundView';
import SettingsView from '../views/settings/SettingsView';
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
                {path: 'polyCarbonCalculate', element: <PolyCarbonCalculate/>},
                {path: 'glassCalculate', element: <GlassCalculate/>},
                {path: 'settings', element: <SettingsView/>},
                {path: '404', element: <NotFoundView/>},
                {path: '*', element: <Navigate to="/polyCarbonCalculate"/>}
            ]
        }
    ];
};



export default getRoutes;
