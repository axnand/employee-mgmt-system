'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import TransfersPage from './AdminTransfer';
import LocalTransfersPage from './LocalTransfer';

function page() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "mainAdmin" && <TransfersPage/>}
    {userRole === "localAdmin" && <LocalTransfersPage/>}
    </>
    
  )
}

export default page