'use client'

import api, { ResponseJson } from "@/lib/api";
import { IAuthContext, useAuthContext } from "@/lib/contexts/auth.context";
import AppButton, { BUTTON_TYPE } from "@/shared/components/Button";
import AppInput from "@/shared/components/Input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [organization, setOrganization] = useState('');

    const { login } = (useAuthContext() as IAuthContext);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleFormSubmit = async (e: React.MouseEvent | React.SubmitEvent) => {
        e.preventDefault();
        if(!email.length) {
            toast.error('Email is required');
            return;
        }
        if(!password.length) {
            toast.error('Password is required');
            return;
        }
        if(!confirmPassword.length) {
            toast.error('Confirm Password is required');
            return;
        }
        if(!emailRegex.test(email)) {
            toast.error('Invalid Email');
            return;
        }
        if(!organization.length) {
            toast.error('Organization is required');
            return;
        }
        if(password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        const signupDetails = {
            email,
            password,
            organization
        };
        try {
            const response = await api.post<ResponseJson<{token: string}>>('public/auth/sign-up', signupDetails);
            if(response.data.success) {
                handleClearForm(e);
                login(response.data.data.token);
            }
        } catch (error) {
            console.log("SignUp Failed", error);
        }
    }

    const handleClearForm = (e: React.SubmitEvent | React.MouseEvent) => {
        e.preventDefault();
        if(email.length || password.length || confirmPassword.length || organization.length) {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setOrganization("");
        }
    }

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex flex-col gap-4 justify-center items-start w-[30%] p-4">
                <h2 className="text-4xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={(e) => handleFormSubmit(e)} className="w-full flex flex-col gap-4">
                    <AppInput label="Email" type="text" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}></AppInput>
                    <AppInput label="Password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></AppInput>
                    <AppInput label="Confirm Password" type="password" placeholder="re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></AppInput>
                    <AppInput label="Organization" type="text" placeholder="organisation name" value={organization} onChange={(e) => setOrganization(e.target.value)}></AppInput>
                    <div className="flex justify-end gap-8 pt-8">
                        <AppButton type="reset" buttontype={BUTTON_TYPE.SECONDARY} onClick={(e) => handleClearForm(e)} >Clear</AppButton>
                        <AppButton type="submit" buttontype={BUTTON_TYPE.PRIMARY} onClick={(e) => handleFormSubmit(e)} >Sign Up</AppButton>
                    </div>
                </form>
                <div>Have an account? <Link href="/login" className="text-blue-400 underline">Login</Link></div>
            </div>
        </div>
    )
}

export default SignUp;