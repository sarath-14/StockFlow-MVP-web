'use client'

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_KEYS, localstorage } from "../localstorage";
import Swal from "sweetalert2";
import { COLORS } from "../colors";
import { jwtDecode } from "jwt-decode";

export interface IAuthUser {
    user: string;
    email: string;
    organization: string;
}

export interface IAuthContext {
    user: IAuthUser | undefined,
    loading: boolean,
    login: (token: string) => void,
    logout: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IAuthUser | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const token = localstorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        const loggedInUser = localstorage.getItem(LOCAL_STORAGE_KEYS.USER);
        
        if(token && loggedInUser) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setUser(() => JSON.parse(loggedInUser));
        }
        else setUser(undefined);

        setLoading(false);
    }, []);

    const login = (token: string) => {
        if(token) {
            const user: IAuthUser = jwtDecode(token);

            localstorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
            localstorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
            
            setUser(() => user);
            router.replace('/dashboard');
        };
    }

    const logout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: COLORS.BUTTON_DANGER_BACKGROUND_COLOR,
            cancelButtonColor: COLORS.BUTTON_SECONDARY_BACKGROUND_COLOR,
            confirmButtonText: 'Logout'
        }).then(result => {
            if(result.isConfirmed) {
                localstorage.clearItems();
                setUser(undefined);
                router.replace('/login');
            }
        })
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}