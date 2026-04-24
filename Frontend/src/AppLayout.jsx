import React from 'react'
import NavBar from './features/ui/NavBar'
import { Outlet } from 'react-router'

const AppLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>

    )
}

export default AppLayout