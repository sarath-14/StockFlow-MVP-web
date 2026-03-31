'use client'

import { IAuthContext, useAuth } from "@/lib/contexts/auth.context"
import { useEffect, useRef, useState } from "react";
import AppInput from "./Input";
import { toast } from "sonner";
import api, { ResponseJson } from "@/lib/api";
import { ISettings } from "@/lib/models/settings.model";

const AppNavbar = () => {

  const { user, logout } = (useAuth() as IAuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState(0);

  // eslint-disable-next-line
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDisplayName = (text: string) => {
    return text[0];
  }

  const toggleShowSettings = () => {
    setShowSettings(setting => !setting);
  }

  const getThreshold = async () => {
    const response = await api.get<ResponseJson<ISettings>>('settings');
    if(response.data.success) {
      const newThreshold = response.data.data.threshold;
      setThreshold(newThreshold);
    }
  }

  const updateThreshold = async (value: number) => {
    const response = await api.post<ResponseJson<ISettings>>('settings', { threshold: value });
    if(response.data.success) {
      setShowSettings(false);
      toast.success('Global Threshold updated successfully');
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    setShowSettings(false);
    if(user) {
      getThreshold();
    }
  }, [user]);

  const handleThresholdChange = (value: string) => {
    const parsed = value.length ? parseInt(value) : 0;
    setThreshold(parsed);
    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      updateThreshold(parsed);
    }, 1000);
  }

  return (
    <div className="flex h-24 p-8 justify-between w-full items-center">
        <div className="text-3xl font-bold">StockFlow MVP</div>
        {user && 
          <div className="relative">
            <div className="rounded-full w-9 h-9 bg-red-300 text-black text-2xl font-semibold text-center cursor-pointer" onClick={toggleShowSettings} >{getDisplayName(user.email)}</div>
            { showSettings && 
              <div className="options absolute w-50 right-2 p-4 flex flex-col gap-8 rounded-md border border-amber-50">
                <AppInput label="Threshold" value={threshold} placeholder="greater than 0" type="number" onChange={(e) => handleThresholdChange(e.target.value)}></AppInput>
                <div className="cursor-pointer flex justify-center items-center bg-red-500 rounded-sm p-1 font-semibold pr-8 pl-8" onClick={logout}>Logout</div>
              </div> 
            }
          </div>
        }
    </div>
  )
}

export default AppNavbar