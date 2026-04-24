import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import PageLoader from '../../ui/PageLoader';

const Protected=({children,role="buyer"})=>{
    const user=useSelector((state)=>state.auth.user);
    const loading=useSelector((state)=>state.auth.loading);

    if(loading){
        return <PageLoader />;
    }

    console.log(user);

    if(!user){
        return <Navigate to="/login" />;
    }

    if(role==="buyer" && user.role!==role){
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default Protected;