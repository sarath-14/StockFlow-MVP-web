import { ButtonHTMLAttributes } from "react";

export enum BUTTON_TYPE {
    PRIMARY = 'Primary',
    SECONDARY = 'Secondary'
}

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttontype: BUTTON_TYPE
}

const AppButton = (props: AppButtonProps) => {

    return (
        <button {...props} className={ "text-md font-semibold pr-4 pl-4 h-9 rounded-lg flex justify-center items-center cursor-pointer transition-all " + (props.buttontype === BUTTON_TYPE.PRIMARY ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-black border border-white text-gray-200 hover:bg-gray-900") }>{ props.children }</button>
    )
}

export default AppButton;