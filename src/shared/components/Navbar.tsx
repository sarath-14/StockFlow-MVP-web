'use client'

import { IAuthContext, useAuthContext } from "@/lib/contexts/auth.context"
import { useEffect, useRef, useState } from "react";
import AppInput from "./Input";
import { ISettingsContext, useSettingsContext } from "@/lib/contexts/settings.context";
import { toast } from "sonner";

const AppNavbar = () => {

  const { user, logout } = (useAuthContext() as IAuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState(0);

  const { settings, updateSettings } = (useSettingsContext() as ISettingsContext);

  // eslint-disable-next-line
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDisplayName = (text: string) => {
    return text?.[0]?.toUpperCase() ?? "U";
  }

  const toggleShowSettings = () => {
    setShowSettings(setting => !setting);
  }

  useEffect(() => {
    // eslint-disable-next-line
    setShowSettings(false);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if(settings === undefined || settings === null) return;
    // eslint-disable-next-line
    setThreshold(settings?.threshold);
  }, [settings])

  const handleThresholdChange = async (value: string) => {
    const parsed = value.length ? parseInt(value, 10) : 0;
    setThreshold(parsed);

    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      await updateSettings(parsed);
      toast.success('Global Threshold updated successfully');
      setShowSettings(false);
    }, 2000);
  }

  return (
    <div className="flex h-24 p-8 justify-between w-full items-center">
        <div className="text-3xl font-bold">StockFlow MVP</div>
        {user && 
          <div className="relative">
            <div className="rounded-full w-9 h-9 bg-red-300 text-black text-xl font-semibold flex items-center justify-center cursor-pointer" onClick={toggleShowSettings} >{getDisplayName(user.email)}</div>
            { showSettings && 
              <div className="options absolute w-50 right-2 p-4 flex flex-col gap-8 rounded-md border bg-black border-amber-50 z-30">
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