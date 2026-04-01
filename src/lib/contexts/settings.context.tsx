'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { ISettings } from "../models/settings.model"
import { IAuthContext, useAuthContext } from "./auth.context";
import api, { ResponseJson } from "../api";

export interface ISettingsContext {
    settings: ISettings | undefined,
    updateSettings: (value: number) => Promise<void>,
}

const SettingsContext = createContext<ISettingsContext | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<ISettings | undefined>(undefined);

    const { user } = (useAuthContext() as IAuthContext);

    const fetchSettings = async () => {
        try {
            const response = await api.get<ResponseJson<ISettings>>('settings');
            if(response.data.success) {
                const newSettings = response.data.data;
                setSettings(newSettings);
            }
            
        } catch (error) {
            console.log("Fetch Settings failed", error);
        }
    }

    useEffect(() => {
        if(user) {
            // eslint-disable-next-line
            fetchSettings();
        }
    }, [user])

    const updateSettings = async (value: number) => {
        try {
            const response = await api.post<ResponseJson<ISettings>>('settings', { threshold: isNaN(value) ? 0 : value });
            if(response.data.success) {
                const newSettings = response.data.data;
                setSettings(newSettings);
            }
        } catch (error) {
            console.log("Update settings failed", error);
        }
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            { children }
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => {
    return useContext(SettingsContext);
}