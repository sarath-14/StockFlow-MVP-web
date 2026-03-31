'use client'

import api, { ResponseJson } from "@/lib/api";
import { IAuthContext, useAuth } from "@/lib/contexts/auth.context";
import AppButton, { BUTTON_TYPE } from "@/shared/components/Button";
import AppInput from "@/shared/components/Input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const { login } = (useAuth() as IAuthContext);

    const handleFormSubmit = async (e: React.SubmitEvent | React.MouseEvent) => {
        e.preventDefault();
        if(!email.length) {
            toast.error('Email is required');
            return;
        }
        if(!password.length) {
            toast.error('Password is required');
            return;
        }
        if(!emailRegex.test(email)) {
            toast.error('Invalid Email');
            return;
        }
        const loginDetails = {
            email, password
        }
        const response = await api.post<ResponseJson<{ token: string }>>('public/auth/login', loginDetails);
        if(response.data.success) {
            handleClearForm(e);
            login(response.data.data.token);
        }
    }

    const handleClearForm = (e: React.SubmitEvent | React.MouseEvent) => {
        e.preventDefault();
        if(email.length || password.length) {
            setEmail("");
            setPassword("");
        }
    }

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col gap-4 justify-center items-start w-[30%] p-4">
                <h2 className="text-4xl font-bold mb-4">Login</h2>
                <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-4">
                    <AppInput label="Email" type="text" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}></AppInput>
                    <AppInput label="Password" type="password"  placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></AppInput>
                    <div className="flex justify-end gap-8 pt-8">
                        <AppButton type="reset" buttontype={BUTTON_TYPE.SECONDARY} onClick={handleClearForm} >Clear</AppButton>
                        <AppButton type="submit" buttontype={BUTTON_TYPE.PRIMARY} onClick={handleFormSubmit} >Login</AppButton>
                    </div>
                </form>
                <div>Dont have an account? <Link href="/signup" className="text-blue-400 underline">Sign Up</Link></div>
            </div>
        </div>
    )
}

export default Login;