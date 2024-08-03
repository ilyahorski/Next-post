import { useState, useEffect, useRef } from "react";
import { PiTrashLight } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import useClickOutside from "~/utils/hooks/useClickOutside";
import { Cropper } from "react-mobile-cropper";
import "react-mobile-cropper/dist/style.css";
import imageCompression from "browser-image-compression";

const SettingsPopover = ({
  popoverRef,
  onClose,
  chat,
  background,
  setBackground,
}) => {
  const pathname = usePathname().split("/")[2];
  const router = useRouter();
  const [backgrounds, setBackgrounds] = useState([]);
  const [chatName, setChatName] = useState(chat?.chatName);
  const [chatImage, setChatImage] = useState(chat?.chatImage);
  const [cropperVisible, setCropperVisible] = useState(false);
  const cropperRef = useRef(null);

  useClickOutside(popoverRef, onClose);

  useEffect(() => {
    fetch("/assets/bg/backgrounds.json")
      .then((response) => response.json())
      .then((data) => setBackgrounds(data));
  }, []);

  const handleSelectChange = (event) => {
    setBackground(event.target.value);
  };

  const handleNameChange = (event) => {
    setChatName(event.target.value);
  };

  const handleSaveBackground = () => {
    const storageKey = `chat-background-${chat._id}`;
    localStorage.setItem(storageKey, background);
    onClose();
  };

  const handleSaveChatData = async () => {
    let cropper = cropperRef.current;
    let dataURL;

    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas !== null) {
        dataURL = canvas.toDataURL("image/jpeg", 1);
      }
    }

    if (dataURL) {
      const compressedFile = await compressImage(dataURL);
      dataURL = await convertFileToBase64(compressedFile);
    }

    fetch(`/api/chats/${chat._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatName,
        chatImage: dataURL || chatImage,
      }),
    }).then(() => onClose());
    setCropperVisible(false);
    window.location.reload();
  };

  const compressImage = async (dataURL) => {
    const file = dataURLToFile(dataURL, "image.jpg");
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 50,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
    }
  };

  const dataURLToFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperVisible(true);
        setChatImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this chat and all messages?"
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/chats/${pathname}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete chat: ${response.status}`);
        }

        router.push("/chat");
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  return (
    <div
      ref={popoverRef}
      className="bg-zinc-800 h-fit p-4 rounded-lg shadow-lg max-w-1/2 relative overflow-y-auto"
    >
      <div className="flex flex-col items-start gap-4 mt-8">
        <label className="text-[16px] font-light text-zinc-200">
          Change chat image
        </label>
        <div className="flex flex-col w-full gap-2">
          <div className="flex w-full gap-2 items-center">
            <input className="w-full" type="file" accept="image/*" onChange={handleImageChange} />
            <button
              className="w-[50px] p-2.5 items-center justify-center"
              onClick={handleSaveChatData}
            >
              OK
            </button>
          </div>

          {cropperVisible && (
            <div className={chatImage ? "w-[250px] h-[250px]" : "hidden"}>
              <Cropper
                ref={cropperRef}
                src={chatImage}
                className="cropper"
                stencilProps={{
                  grid: true,
                }}
              />
            </div>
          )}
        </div>

        <label className="text-[16px] font-light text-zinc-200">
          Change chat name
        </label>
        <div className="flex w-full gap-2">
          <input
            className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            type="text"
            value={chatName}
            onChange={handleNameChange}
          />

          <button
            className="w-[50px] p-2.5 items-center justify-center"
            onClick={handleSaveChatData}
          >
            OK
          </button>
        </div>
        <label className="text-[16px] font-light text-zinc-200">
          Change chat background
        </label>
        <div className="flex w-full gap-2">
          <select
            onChange={handleSelectChange}
            value={background}
            className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Выберите фон</option>
            {backgrounds.map((bg) => (
              <option key={bg.id} value={bg.path}>
                {bg.name}
              </option>
            ))}
          </select>
          <button
            className="w-[50px] p-2.5 items-center justify-center"
            onClick={handleSaveBackground}
          >
            OK
          </button>
        </div>
      </div>
      {pathname === chat._id && (
        <button
          title="Delete chat"
          className="mt-8 flex gap-4 text-[16px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
          onClick={() => handleDelete()}
        >
          <PiTrashLight className="w-[20px] h-[20px] mob:w-[30px] mob:h-[30px]" />
          <span>Delete chat</span>
        </button>
      )}
    </div>
  );
};

export default SettingsPopover;
