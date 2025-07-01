import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../../../pageAssets/sideBarNav';

const Help = () => {
    return (
        <>
            <SideBarNav />
            <Outlet />
        </>
    );
};
export default Help;
