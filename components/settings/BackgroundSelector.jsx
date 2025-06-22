import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

import OkButton from "./OkButton";

const BackgroundSelector = ({ background, onBackgroundUpdate, onTemporaryBackgroundChange }) => {
    const [backgrounds, setBackgrounds] = useState([]);
    const [currentBackground, setCurrentBackground] = useState(background);
    const [originalBackground] = useState(background);

    useEffect(() => {
        fetch("/assets/bg/backgrounds.json")
            .then((response) => response.json())
            .then((data) => setBackgrounds(data))
            .catch((error) => console.error("Error loading backgrounds:", error));
    }, []);

    const handleSelectChange = (event) => {
        const newBackground = event.target.value;
        setCurrentBackground(newBackground);

        // Временно изменяем фон для предварительного просмотра
        if (onTemporaryBackgroundChange) {
            onTemporaryBackgroundChange(newBackground);
        }
    };

    const handleSave = () => {
        onBackgroundUpdate(currentBackground);
    };

    const handleCancel = () => {
        setCurrentBackground(originalBackground);
        // Возвращаем оригинальный фон
        if (onTemporaryBackgroundChange) {
            onTemporaryBackgroundChange(originalBackground);
        }
    };

    return (
        <div className="flex flex-col w-full gap-2">
            <label htmlFor="background-select" className="text-[16px] font-light text-zinc-200">
                Change chat background
            </label>
            <div className="flex w-full gap-2">
                <select
                    onChange={handleSelectChange}
                    value={currentBackground}
                    className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">Select background</option>
                    {backgrounds.map((bg) => (
                        <option key={bg.id} value={bg.path}>
                            {bg.name}
                        </option>
                    ))}
                </select>
                <div className="flex gap-1">
                    <button className="p-2 text-sm" onClick={handleCancel} title="Cancel changes">
                        <CgClose className="w-8 h-8 text-red-500" />
                    </button>
                    <OkButton onClick={handleSave} title="Apply background" />
                </div>
            </div>
        </div>
    );
};

export default BackgroundSelector;
