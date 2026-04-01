'use client'

import { COLORS } from '@/lib/colors';
import { IAuthContext, useAuthContext } from '@/lib/contexts/auth.context'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { ClipLoader } from 'react-spinners';

const AuthLayout = ({ children }: Readonly<{children: React.ReactNode}>) => {
  const { user, loading } = (useAuthContext() as IAuthContext); 
  const router = useRouter();

  useEffect(() => {
    if(user) {
        router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <>
        { loading ? <ClipLoader color={COLORS.SPINNER_COLOR} size={35} speedMultiplier={0.8} /> : (!user && children)}
    </>
  )
}

export default AuthLayout