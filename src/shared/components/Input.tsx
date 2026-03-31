import { InputHTMLAttributes } from "react";

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const AppInput = (props: AppInputProps) => {
    return (
        <div className="flex flex-col gap-2 justify-center items-start">
            <div className="text-lg">{ props.label }</div>
            <div className="border border-amber-50 justify-center items-center w-full rounded-lg">
                <input {...props} className="border-0 outline-0 bg-transparent placeholder:text-gray-500 text-sm align-middle h-full w-full p-3" />
            </div>
        </div>
    )
}

export default AppInput;