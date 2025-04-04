'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import StaffDashboard from './StaffDashboard'
import AdminDashboardPage from './AdminDashboardPage'
import SchoolAdminDashboard from './SchoolAdminDashboard'

function page() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "CEO" && <AdminDashboardPage/>}
    {userRole === "ZEO" && <AdminDashboardPage/>}
    {userRole === "schoolAdmin" && <SchoolAdminDashboard/>}
    {userRole === "staff" && <StaffDashboard/>}
    </>
    
  )
}

export default page