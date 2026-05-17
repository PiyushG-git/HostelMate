import React from 'react'
import Nav from '../features/Shared/Components/Nav'
import { Outlet, useLocation } from 'react-router'

const AppLayout = () => {
    const location = useLocation()
    const isHome   = location.pathname === '/'

    return (
        <>
            <Nav />
            <Outlet />
        </>
    )
}

export default AppLayout