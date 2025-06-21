import { useState, useEffect } from "react";

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
      <label className="text-[16px] font-light text-zinc-200">
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
          <button
            className="px-3 py-2.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            onClick={handleCancel}
            title="Cancel changes"
          >
            Cancel
          </button>
          <button
            className="px-3 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={handleSave}
            title="Apply background"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
