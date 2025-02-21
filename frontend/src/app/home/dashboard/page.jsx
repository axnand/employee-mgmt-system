'use client'
import React from 'react'
import MainDashboardPage from './MainDashboardPage'
import { useUser } from '@/context/UserContext'
import LocalAdminDashboard from './LocalAdminDashboard';

function page() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "mainAdmin" && <MainDashboardPage/>}
    {userRole === "localAdmin" && <LocalAdminDashboard/>}
    </>
    
  )
}

export default page