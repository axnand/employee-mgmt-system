'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import AdminLogs from './AdminLogs';
import LocalLogsPage from './LocalLogs';

function page() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "CEO" || userRole === "ZEO" && <AdminLogs/>}
    {userRole === "schoolAdmin" && <LocalLogsPage/>}
    </>
    
  )
}

export default page