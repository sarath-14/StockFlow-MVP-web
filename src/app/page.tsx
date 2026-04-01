'use client'

import { useAuthContext } from "../lib/contexts/auth.context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const user = useAuthContext()?.user;
  const router = useRouter();

  useEffect(() => {
    if(user) {
      router.replace('/dashboard');
    }
    else {
      router.replace('/login');
    }
  }, []);

  return (
    <></>
  );
}

export default Home;
