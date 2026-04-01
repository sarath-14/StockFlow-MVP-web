'use client'

import { IAuthContext, useAuthContext } from '@/lib/contexts/auth.context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  const { user } = (useAuthContext() as IAuthContext);  
  const router = useRouter();

  useEffect(() => {
    if(!user) {
        router.replace('/');
    }
  }, [user, router]);

  return (
    <div className="flex flex-1 w-full">
        {(user && children)}
    </div>
  )
}

export default DashboardLayout