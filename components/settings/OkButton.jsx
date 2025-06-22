import { BsCheckLg } from "react-icons/bs";

const OkButton = ({ onClick, title = "Apply changes", className = "" }) => {
    return (
        <button className={`w-[50px] p-2 flex items-center justify-center ${className}`} onClick={onClick} title={title}>
            <BsCheckLg className="w-8 h-8 text-primary-300" />
        </button>
    );
};

export default OkButton;
